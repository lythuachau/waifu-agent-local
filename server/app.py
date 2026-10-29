"""
Local ZeroWeight-compatible API for Waifu Agent.

Talks the same REST + speech-socket contract as api.zeroweight.ai so a patched
unpacked CRX can run with Ollama / LM Studio / any OpenAI-compatible LLM and
never touch ZeroWeight.
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
import re
import time
from pathlib import Path

import httpx
from fastapi import FastAPI, Header, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles

import speech as local_speech
import codex_llm

log = logging.getLogger("zw.local")

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
STATIC = ROOT / "static"
HOST = os.environ.get("ZW_LOCAL_HOST", "127.0.0.1")
PORT = int(os.environ.get("ZW_LOCAL_PORT", "8787"))
PUBLIC = os.environ.get("ZW_PUBLIC_BASE", f"http://{HOST}:{PORT}")
LLM_BASE = os.environ.get("LLM_BASE_URL", "http://127.0.0.1:11434/v1").rstrip("/")
LLM_KEY = os.environ.get("LLM_API_KEY", "ollama")
LLM_MODEL = os.environ.get("LLM_MODEL", "llama3.2")
VISION_MODEL = os.environ.get("VISION_MODEL", LLM_MODEL)
TTS_VOICE = os.environ.get("TTS_VOICE", "ja-JP-NanamiNeural")
SETTINGS_PATH = DATA / "settings.json"
DEFAULT_SETTINGS = {
    "llm_backend": "ollama",
    "ollama_model": "llama3.2",
    "codex_model": "gpt-6-luna",
    "default_engine": "auto",
    "default_edge": "ja-JP-NanamiNeural",
    "voice_map": {},
    "tts_gateway": "local",
}
ZW_API = os.environ.get("ZW_API", "https://api.zeroweight.ai/api/v1").rstrip("/")

PERSONAS = json.loads((DATA / "personas.json").read_text(encoding="utf-8"))
AVATARS = json.loads((DATA / "avatars.json").read_text(encoding="utf-8"))
OFFLINE_TOKENS = DATA / "offline_tokens"
OFFLINE_PERSONAS = DATA / "offline_personas"
if OFFLINE_PERSONAS.exists():
    for p in OFFLINE_PERSONAS.glob("*.json"):
        rec = json.loads(p.read_text(encoding="utf-8"))
        PERSONAS[p.stem] = rec

app = FastAPI(title="Waifu Agent Local", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
if (STATIC / "avatars").exists():
    app.mount("/static", StaticFiles(directory=STATIC), name="static")

local_speech.start_warmup()


def any_key(_x_zw_api_key: str | None, authorization: str | None) -> str:
    if _x_zw_api_key:
        return _x_zw_api_key
    if authorization and authorization.lower().startswith("bearer "):
        return authorization[7:].strip()
    return "local"


def persona_for(avatar_id: str) -> dict:
    if avatar_id in PERSONAS:
        return PERSONAS[avatar_id]
    name = next((a["name"] for a in AVATARS if a["id"] == avatar_id), avatar_id)
    return {
        "avatar_id": avatar_id,
        "display_name": name,
        "persona_prompt": f"You are {name}, a browser companion. Match the user's language. Keep replies short. Never invent facts.",
        "persona_knowledge": "Local self-hosted companion.",
        "actions": {
            "wave_hand": {"display_name": "Wave", "description": "Greeting wave."},
            "speaking": {"display_name": "Speaking", "description": "Talking."},
            "listening": {"display_name": "Listening", "description": "Idle."},
        },
        "voice_id": f"{avatar_id}-local",
        "voice_provider": "minimax",
    }


def local_image(avatar_id: str) -> str:
    for ext in (".webp", ".png", ".jpg"):
        p = STATIC / "avatars" / f"{avatar_id}{ext}"
        if p.exists():
            return f"{PUBLIC}/static/avatars/{avatar_id}{ext}"
    for a in AVATARS:
        if a["id"] == avatar_id:
            cover = (a.get("cover") or {})
            return cover.get("full_thumb_url") or cover.get("thumb_url") or ""
    return ""


@app.get("/")
def root():
    rec = load_settings()
    return {
        "message": "AI Avatar Public Service Running",
        "local": True,
        "llm": LLM_BASE,
        "model": LLM_MODEL,
        "backend": rec.get("llm_backend"),
        "codex_logged_in": codex_llm.logged_in(),
        "settings": f"{PUBLIC}/settings",
    }


@app.get("/api/v1/avatars/system")
def list_system(limit: int = 20, offset: int = 0):
    return AVATARS[offset : offset + limit]


@app.get("/api/v1/avatars/mine")
def list_mine(
    limit: int = 20,
    offset: int = 0,
    x_zw_api_key: str | None = Header(default=None, alias="X-ZW-Api-Key"),
    authorization: str | None = Header(default=None),
):
    any_key(x_zw_api_key, authorization)
    return AVATARS[offset : offset + limit]


@app.get("/api/v1/avatars/{avatar_id}/persona")
def get_persona(
    avatar_id: str,
    x_zw_api_key: str | None = Header(default=None, alias="X-ZW-Api-Key"),
    authorization: str | None = Header(default=None),
):
    any_key(x_zw_api_key, authorization)
    return persona_for(avatar_id)


@app.get("/api/v1/avatars/bundle/{avatar_id}")
def get_bundle(
    avatar_id: str,
    x_zw_api_key: str | None = Header(default=None, alias="X-ZW-Api-Key"),
    authorization: str | None = Header(default=None),
):
    any_key(x_zw_api_key, authorization)
    token_path = OFFLINE_TOKENS / f"{avatar_id}.json"
    if token_path.exists():
        return json.loads(token_path.read_text(encoding="utf-8"))
    image = local_image(avatar_id)
    return {
        "payload": {
            "zw_local": True,
            "id": avatar_id,
            "image": image,
            "videos": {},
        }
    }


def zw_developer_key() -> str:
    env = (os.environ.get("ZW_KEY") or "").strip()
    if env:
        return env
    path = DATA / "zw_key.txt"
    if path.exists():
        try:
            return path.read_text(encoding="utf-8").strip()
        except Exception:
            return ""
    return ""


def load_settings() -> dict:
    rec = dict(DEFAULT_SETTINGS)
    env = (os.environ.get("LLM_BACKEND") or "").strip().lower()
    if env in ("ollama", "codex"):
        rec["llm_backend"] = env
    if SETTINGS_PATH.exists():
        try:
            rec.update(json.loads(SETTINGS_PATH.read_text(encoding="utf-8")))
        except Exception:
            pass
    if rec.get("llm_backend") not in ("ollama", "codex"):
        rec["llm_backend"] = "ollama"
    rec["codex_model"] = rec.get("codex_model") or "gpt-6-luna"
    rec["ollama_model"] = rec.get("ollama_model") or LLM_MODEL
    rec["default_engine"] = rec.get("default_engine") or "auto"
    rec["default_edge"] = rec.get("default_edge") or "ja-JP-NanamiNeural"
    rec["voice_map"] = rec.get("voice_map") if isinstance(rec.get("voice_map"), dict) else {}
    rec["tts_gateway"] = rec.get("tts_gateway") if rec.get("tts_gateway") in ("local", "zeroweight") else "local"
    return rec


def save_settings(rec: dict) -> dict:
    current = load_settings()
    if rec.get("llm_backend") in ("ollama", "codex"):
        current["llm_backend"] = rec["llm_backend"]
    if rec.get("codex_model"):
        current["codex_model"] = str(rec["codex_model"])
    if rec.get("ollama_model"):
        current["ollama_model"] = str(rec["ollama_model"])
    if rec.get("default_engine") in ("auto", "gtts", "edge", "zerotts"):
        current["default_engine"] = rec["default_engine"]
    if rec.get("default_edge"):
        current["default_edge"] = str(rec["default_edge"])
    if isinstance(rec.get("voice_map"), dict):
        cleaned = {}
        for vid, spec in rec["voice_map"].items():
            if isinstance(spec, str):
                cleaned[str(vid)] = {"edge": spec}
            elif isinstance(spec, dict):
                item = {}
                if spec.get("edge"):
                    item["edge"] = str(spec["edge"])
                if spec.get("engine") in ("auto", "gtts", "edge", "zerotts"):
                    item["engine"] = spec["engine"]
                if item:
                    cleaned[str(vid)] = item
        current["voice_map"] = cleaned
    if rec.get("tts_gateway") in ("local", "zeroweight"):
        current["tts_gateway"] = rec["tts_gateway"]
    SETTINGS_PATH.write_text(json.dumps(current, indent=2, ensure_ascii=False), encoding="utf-8")
    local_speech.reload_voices()
    return current


@app.get("/api/v1/llm/models")
@app.get("/api/v1/companion/models")
@app.get("/api/v1/vision/models")
async def list_models():
    data = [{"id": LLM_MODEL, "object": "model", "owned_by": "local"}]
    if load_settings().get("llm_backend") == "codex" or codex_llm.logged_in():
        data = [{"id": load_settings().get("codex_model") or "gpt-6-luna", "object": "model", "owned_by": "codex"}] + [
            m for m in data if m["id"] != LLM_MODEL
        ]
        for mid in codex_llm.list_model_ids():
            if not any(x["id"] == mid for x in data):
                data.append({"id": mid, "object": "model", "owned_by": "codex"})
    return {"object": "list", "data": data}


EMOTIONS = ("neutral", "happy", "sad", "angry", "excited", "scared", "content")
PLAIN_OUTPUT = """[OUTPUT]
You are in a live chat. Your entire answer is the chat bubble, nothing else.

Good: heyy, what's up?
Good: ủa vậy hả, kể mình nghe đi

Forbidden (never write these words or this layout):
Reply
messages:
text:
tts_text:
emotion:
run tool
JSON
YAML

Do not repeat the user's message. Match their language. One or two short sentences.
"""
OUTPUT_BLOCK = re.compile(r"\[OUTPUT\][\s\S]*?(?=\n\[[A-Z]|\Z)")
RUN_TOOL = re.compile(r"(?is)(?:run|call(?:ing)?)\s+(?:the\s+)?tool\s+[A-Za-z_][\w]*\s*")
QUOTED_FIELD = re.compile(r'"(message|text|tts_text)"\s*:\s*"((?:\\.|[^"\\])*)"')
SCHEMA_LINE = re.compile(
    r"(?im)^[ \t]*(?:-[ \t]*)?(emotion|messages|tts_text|tts|text|message)[ \t]*:[ \t]*(.*?)[ \t]*$"
)
ROLE_PREFIX = re.compile(
    r"(?is)^(?:#{1,3}[ \t]*)?(assistant|user|system|reply)\s*(?:[:|\-]+\s*|\n+)+"
)
TAIL_NUDGE = (
    "Your next assistant turn is one or two chat sentences only. "
    "Do not output Reply, messages:, text:, tts_text:, emotion:, JSON, or run tool."
)


def active_llm_model(vision: bool = False) -> str:
    rec = load_settings()
    if rec.get("llm_backend") == "codex":
        return rec.get("codex_model") or "gpt-6-luna"
    if vision:
        return rec.get("ollama_model") or VISION_MODEL
    return rec.get("ollama_model") or LLM_MODEL


def rewrite_body(body: dict, vision: bool = False) -> dict:
    out = dict(body)
    out["model"] = active_llm_model(vision)
    return out


def unescape_json_str(value: str) -> str:
    try:
        return json.loads(f'"{value}"')
    except Exception:
        return value.replace('\\"', '"').replace("\\n", "\n")


def last_user_text(body: dict) -> str:
    for m in reversed(body.get("messages") or []):
        if m.get("role") != "user":
            continue
        c = m.get("content")
        if isinstance(c, str):
            return c.strip()
        if isinstance(c, list):
            parts = [
                str(p.get("text") or "")
                for p in c
                if isinstance(p, dict) and p.get("type") in ("text", None)
            ]
            return "\n".join(p for p in parts if p).strip()
    return ""


def strip_echo(text: str, last_user: str) -> str:
    raw = (text or "").strip()
    user = (last_user or "").strip()
    if not raw or not user or len(raw) <= len(user):
        return raw
    if raw[: len(user)].lower() != user.lower():
        return raw
    nxt = raw[len(user)]
    if nxt not in " \n\r\t:-–.,":
        return raw
    rest = raw[len(user) :].lstrip(" \n\r\t:-–.,")
    return rest if rest else raw


def strip_role_prefix(text: str) -> str:
    raw = (text or "").strip()
    while True:
        nxt = ROLE_PREFIX.sub("", raw, count=1).strip()
        if nxt == raw:
            return raw
        raw = nxt


def looks_like_tool_dump(text: str) -> bool:
    t = (text or "").lstrip()
    if not t:
        return False
    low = t.lower()
    if re.match(r"(?is)^(run\s+tool|call\s+tool|reply)\b", t):
        return True
    if re.match(r"(?im)^(emotion|messages|text|tts_text)\s*:", t):
        return True
    if re.search(r"(?im)^\s*tts_text\s*:", t) and re.search(r"(?im)^\s*(?:text|messages)\s*:", t):
        return True
    if '"messages"' in low[:160] or (low.startswith("{") and "tts_text" in low):
        return True
    return False


def yamlish_reply(text: str) -> dict | None:
    raw = text or ""
    if not SCHEMA_LINE.search(raw):
        return None
    emotion = "neutral"
    texts: list[str] = []
    tts: list[str] = []
    for m in SCHEMA_LINE.finditer(raw):
        key = m.group(1).lower()
        val = (m.group(2) or "").strip().strip("\"'")
        if key == "messages" and val.startswith("["):
            try:
                arr = json.loads(val)
            except Exception:
                arr = None
            if isinstance(arr, list):
                for item in arr[:3]:
                    msg = as_message(item)
                    if msg:
                        texts.append(msg["text"])
                        tts.append(msg["tts_text"])
                continue
        if not val or val in ("|", ">", "[", "{", "[]", "{}"):
            continue
        if key == "emotion":
            emotion = val.split()[0].lower()
        elif key in ("text", "message"):
            texts.append(val)
        elif key in ("tts_text", "tts"):
            tts.append(val)
    if not texts and tts:
        texts = tts[:1]
    if not texts:
        return None
    msgs = []
    if len(texts) == 1:
        spoken = tts[-1] if tts else texts[0]
        msgs.append({"text": texts[0], "tts_text": spoken})
    else:
        for i, t in enumerate(texts[:3]):
            spoken = tts[i] if i < len(tts) else t
            msgs.append({"text": t, "tts_text": spoken})
    return {"emotion": emotion, "messages": msgs}


def quoted_fields(text: str) -> dict[str, str]:
    found: dict[str, str] = {}
    for key, val in QUOTED_FIELD.findall(text or ""):
        if key not in found:
            found[key] = unescape_json_str(val)
    return found


def scrub_companion_messages(messages: list) -> list:
    out = []
    for m in messages or []:
        role = m.get("role")
        content = m.get("content")
        if role == "system" and isinstance(content, str):
            if OUTPUT_BLOCK.search(content):
                content = OUTPUT_BLOCK.sub(PLAIN_OUTPUT, content)
            elif "[OUTPUT]" not in content:
                content = content.rstrip() + "\n\n" + PLAIN_OUTPUT
            out.append({**m, "content": content})
            continue
        if role == "assistant" and isinstance(content, str) and looks_like_tool_dump(content):
            spoken = coerce_reply(content)["messages"][0]["text"]
            if spoken and not looks_like_tool_dump(spoken):
                out.append({**m, "content": spoken})
                continue
        out.append(m)
    return out


def extract_json_obj(text: str) -> dict | None:
    if not text or not isinstance(text, str):
        return None
    raw = text.strip()
    fence = re.search(r"```(?:json)?\s*([\s\S]*?)```", raw)
    if fence:
        raw = fence.group(1).strip()
    for candidate in (raw,):
        try:
            val = json.loads(candidate)
            if isinstance(val, dict):
                return val
        except Exception:
            pass
    start, end = raw.find("{"), raw.rfind("}")
    if start >= 0 and end > start:
        try:
            val = json.loads(raw[start : end + 1])
            if isinstance(val, dict):
                return val
        except Exception:
            pass
    return None


def as_message(item) -> dict | None:
    if isinstance(item, str) and item.strip() and not item.strip().startswith("{"):
        text = item.strip()
        return {"text": text, "tts_text": re.sub(r"[*_`#>~]", "", text)}
    if isinstance(item, dict):
        text = item.get("text") or item.get("content") or item.get("message") or ""
        if not isinstance(text, str):
            return None
        text = text.strip()
        if not text:
            return None
        if text.startswith("{") and extract_json_obj(text):
            return None
        tts = item.get("tts_text") or item.get("tts") or text
        return {"text": text, "tts_text": str(tts).strip() or text}
    return None


def coerce_reply(content: str, parsed: dict | None = None, last_user: str = "") -> dict:
    raw = strip_echo((content or "").strip(), last_user)
    obj = parsed if isinstance(parsed, dict) else extract_json_obj(raw) or {}
    if isinstance(obj.get("parameters"), dict):
        obj = obj["parameters"]
    if isinstance(obj.get("arguments"), dict):
        obj = obj["arguments"]
    if not obj:
        yml = yamlish_reply(raw)
        if yml:
            obj = yml
    if not obj:
        fields = quoted_fields(raw)
        if fields.get("message") or fields.get("text"):
            obj = {
                "emotion": "happy",
                "message": fields.get("message") or fields.get("text"),
                "tts_text": fields.get("tts_text"),
            }
    emotion = str(obj.get("emotion") or "neutral").lower()
    if emotion not in EMOTIONS:
        emotion = "happy" if emotion in {"polite", "cheerful", "smile", "joy", "glad", "smiling face"} else "neutral"
    out: list[dict] = []
    msgs = obj.get("messages")
    if isinstance(msgs, list):
        for item in msgs[:3]:
            if isinstance(item, str) and item.strip().startswith("{"):
                nested = coerce_reply(item, last_user=last_user)
                out.extend(nested["messages"])
                if nested.get("emotion") in EMOTIONS:
                    emotion = nested["emotion"]
                continue
            msg = as_message(item)
            if msg and not looks_like_tool_dump(msg["text"]):
                out.append(msg)
    if not out:
        for key in ("text", "content", "message"):
            val = obj.get(key)
            msg = as_message(val) if isinstance(val, (str, dict)) else None
            if msg and not looks_like_tool_dump(msg["text"]):
                if obj.get("tts_text") and not msg.get("tts_text"):
                    msg["tts_text"] = str(obj["tts_text"])
                out.append(msg)
                break
    if not out:
        cleaned = RUN_TOOL.sub(" ", raw).strip()
        cleaned = re.sub(r"(?im)^(emotion|messages|tts_text)\s*:.*$", "", cleaned).strip()
        cleaned = re.sub(r"^\{[\s\S]*$", "", cleaned).strip()
        if looks_like_tool_dump(cleaned) or cleaned.startswith("{") or cleaned.startswith("```"):
            cleaned = ""
        if not cleaned:
            cleaned = "Mình đây."
        out.append({"text": cleaned, "tts_text": re.sub(r"[*_`#>~]", "", cleaned)})
    for msg in out:
        msg["text"] = strip_role_prefix(strip_echo(msg["text"], last_user))
        msg["tts_text"] = strip_role_prefix(strip_echo(msg.get("tts_text") or msg["text"], last_user))
    out = [m for m in out if m["text"] and not looks_like_tool_dump(m["text"])]
    if not out:
        out = [{"text": "Mình đây.", "tts_text": "Mình đây."}]
    return {"emotion": emotion, "messages": out[:3]}


def tool_name_from(body: dict) -> str:
    choice = body.get("tool_choice")
    if isinstance(choice, dict):
        name = (choice.get("function") or {}).get("name") or choice.get("name")
        if name:
            return name
    tools = body.get("tools") or []
    if tools:
        first = tools[0] if isinstance(tools[0], dict) else {}
        return (first.get("function") or {}).get("name") or first.get("name") or "reply"
    return "reply"


def is_confirm_request(body: dict) -> bool:
    if tool_name_from(body) == "confirm":
        return True
    for t in body.get("tools") or []:
        if not isinstance(t, dict):
            continue
        name = (t.get("function") or {}).get("name") or t.get("name")
        if name == "confirm":
            return True
    blob = " ".join(
        str(m.get("content") or "") for m in (body.get("messages") or []) if isinstance(m, dict)
    ).lower()
    return "confirm" in blob and ("connectivity" in blob or "ok = true" in blob or "ok=true" in blob)


AGENT_ACTION_ALIAS = {
    "click": "click_element_by_index",
    "click_element": "click_element_by_index",
    "click_element_by_index": "click_element_by_index",
    "type": "input_text",
    "input": "input_text",
    "input_text": "input_text",
    "select": "select_dropdown_option",
    "select_dropdown_option": "select_dropdown_option",
    "enter": "press_key",
    "press_enter": "press_key",
    "press_key": "press_key",
    "scroll": "scroll",
    "scroll_down": "scroll",
    "scroll_up": "scroll",
    "wait": "wait",
    "done": "done",
    "finish": "done",
    "act": "act",
    "ask_user": "ask_user",
}

AGENT_OUTPUT_NUDGE = (
    "Return ONE JSON object only, no markdown, no prose. Shape:\n"
    '{"evaluation_previous_goal":"short","memory":"short","next_goal":"short",'
    '"action":{"click_element_by_index":{"index":0}}}\n'
    "action is exactly one key: click_element_by_index {index}, "
    "input_text {index,text}, press_key {key}, scroll {down}, wait {seconds}, "
    "done {text,success}, act {goal}. Use a numeric [index] from Interactive Elements."
)


def _as_int(value) -> int | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)
    if isinstance(value, str) and value.strip().isdigit():
        return int(value.strip())
    return None


def _index_from(obj: dict, content: str, last_user: str) -> int | None:
    for key in ("index", "target_index"):
        n = _as_int(obj.get(key))
        if n is not None:
            return n
    target = obj.get("target")
    n = _as_int(target)
    if n is not None:
        return n
    blob = f"{content}\n{last_user}"
    if isinstance(target, str) and target.strip():
        m = re.search(rf"\[(\d+)\][^\n]{{0,80}}{re.escape(target.strip())}", blob, re.I)
        if m:
            return int(m.group(1))
    m = re.search(r"\[(\d+)\]", content or "")
    if m:
        return int(m.group(1))
    m = re.search(r"\[(\d+)\]", last_user or "")
    if m:
        return int(m.group(1))
    return None


def _tool_input(name: str, raw, obj: dict, content: str, last_user: str) -> dict:
    if isinstance(raw, dict) and raw:
        if name == "click_element_by_index" and _as_int(raw.get("index")) is None:
            n = _index_from({**obj, **raw}, content, last_user)
            if n is not None:
                raw = {**raw, "index": n}
        return raw
    if name == "click_element_by_index":
        n = _index_from(obj, content, last_user)
        return {"index": n if n is not None else 0}
    if name == "input_text":
        n = _index_from(obj, content, last_user)
        text = obj.get("text") or obj.get("value") or (raw if isinstance(raw, str) else "")
        return {"index": n if n is not None else 0, "text": str(text or "")}
    if name == "select_dropdown_option":
        n = _index_from(obj, content, last_user)
        text = obj.get("text") or obj.get("value") or (raw if isinstance(raw, str) else "")
        return {"index": n if n is not None else 0, "text": str(text or "")}
    if name == "press_key":
        key = obj.get("key") or (raw if isinstance(raw, str) else "Enter")
        out = {"key": str(key)}
        n = _index_from(obj, content, last_user)
        if n is not None:
            out["index"] = n
        return out
    if name == "scroll":
        down = obj.get("down")
        if down is None:
            down = str(obj.get("action") or content).lower().find("up") < 0
        return {"down": bool(down)}
    if name == "wait":
        sec = _as_int(obj.get("seconds") or raw) or 1
        return {"seconds": sec}
    if name == "done":
        text = obj.get("text") or (content if isinstance(content, str) else "xong.")
        success = obj.get("success")
        if success is None:
            success = True
        return {"text": str(text)[:2000], "success": bool(success)}
    if name == "act":
        return {"goal": str(obj.get("goal") or raw or content)[:500]}
    if name == "ask_user":
        return {"question": str(obj.get("question") or content)[:500]}
    return raw if isinstance(raw, dict) else {}


def coerce_agent_output(content: str, parsed: dict | None = None, last_user: str = "") -> dict:
    obj = dict(parsed or extract_json_obj(content) or {})
    action = obj.get("action")
    tool_name = None
    raw_input = None
    if isinstance(action, dict) and action:
        tool_name = next(iter(action))
        raw_input = action[tool_name]
    elif isinstance(action, str):
        tool_name = action
        raw_input = obj.get("input") or obj.get("target")
    else:
        for key in list(obj.keys()):
            mapped = AGENT_ACTION_ALIAS.get(key)
            if mapped:
                tool_name = key
                raw_input = obj.get(key)
                break
    mapped = AGENT_ACTION_ALIAS.get((tool_name or "").lower()) if tool_name else None
    if not mapped:
        mapped = "wait"
        raw_input = {"seconds": 1}
    payload = _tool_input(mapped, raw_input, obj, content or "", last_user or "")
    return {
        "evaluation_previous_goal": str(obj.get("evaluation_previous_goal") or "step"),
        "memory": str(obj.get("memory") or ""),
        "next_goal": str(obj.get("next_goal") or mapped),
        "action": {mapped: payload},
    }


def fake_tool_call(body: dict, content: str, parsed: dict | None = None) -> dict:
    name = tool_name_from(body)
    if name == "reply":
        args = coerce_reply(content, parsed, last_user=last_user_text(body))
    elif name == "confirm":
        args = {"ok": True}
    elif name == "route":
        args = {"new_chat": False, "mode": "chat", "about_page": False}
        obj = parsed or extract_json_obj(content) or {}
        for k in ("new_chat", "mode", "about_page"):
            if k in obj:
                args[k] = obj[k]
        if args["mode"] not in ("chat", "task"):
            args["mode"] = "chat"
    elif name == "AgentOutput":
        args = coerce_agent_output(content, parsed, last_user=last_user_text(body))
    else:
        args = parsed or extract_json_obj(content) or {"text": content}
    return {
        "id": "chatcmpl-local",
        "object": "chat.completion",
        "choices": [{
            "index": 0,
            "finish_reason": "tool_calls",
            "message": {
                "role": "assistant",
                "content": None,
                "tool_calls": [{
                    "id": "call_local",
                    "type": "function",
                    "function": {"name": name, "arguments": json.dumps(args, ensure_ascii=False)},
                }],
            },
        }],
        "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
    }


def coerce_existing_tool_calls(body: dict, data: dict) -> dict:
    choice = (data.get("choices") or [{}])[0]
    msg = choice.get("message") or {}
    calls = msg.get("tool_calls") or []
    if not calls:
        return data
    call = calls[0]
    fn = call.get("function") or {}
    name = fn.get("name") or tool_name_from(body)
    raw_args = fn.get("arguments") or "{}"
    parsed = raw_args if isinstance(raw_args, dict) else extract_json_obj(str(raw_args))
    if name == "reply":
        args = coerce_reply(
            str(raw_args),
            parsed if isinstance(parsed, dict) else None,
            last_user=last_user_text(body),
        )
        fn["name"] = "reply"
        fn["arguments"] = json.dumps(args, ensure_ascii=False)
        call["function"] = fn
        calls[0] = call
        msg["tool_calls"] = calls
        choice["message"] = msg
        choice["finish_reason"] = "tool_calls"
        data["choices"] = [choice]
    return data


async def ollama_chat(payload: dict) -> JSONResponse:
    headers = {"Content-Type": "application/json"}
    if LLM_KEY:
        headers["Authorization"] = f"Bearer {LLM_KEY}"
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            r = await client.post(f"{LLM_BASE}/chat/completions", json=payload, headers=headers)
    except httpx.RequestError as e:
        return JSONResponse(
            {"error": {"message": f"local LLM unreachable at {LLM_BASE}: {e}"}},
            status_code=502,
        )
    try:
        data = r.json()
    except Exception:
        return JSONResponse({"error": {"message": r.text[:400]}}, status_code=r.status_code or 502)
    if r.status_code >= 400:
        return JSONResponse(data, status_code=r.status_code)
    return JSONResponse(data)


async def backend_chat(payload: dict, force: str | None = None) -> JSONResponse:
    backend = force or load_settings().get("llm_backend") or "ollama"
    if backend == "codex":
        try:
            data = await codex_llm.chat_completions({
                **payload,
                "model": payload.get("model")
                if payload.get("model") not in (None, "", "zeroweight", LLM_MODEL)
                else load_settings().get("codex_model"),
            })
            return JSONResponse(data)
        except Exception as e:
            log.exception("codex backend_chat failed")
            return JSONResponse({"error": {"message": str(e)}}, status_code=502)
    return await ollama_chat(payload)


def message_content(data: dict) -> tuple[dict, str]:
    choice = (data.get("choices") or [{}])[0]
    msg = choice.get("message") or {}
    content = msg.get("content") or ""
    if isinstance(content, list):
        content = "".join(
            part.get("text", "") if isinstance(part, dict) else str(part) for part in content
        )
    return msg, str(content).strip()


async def proxy_chat(body: dict, vision: bool = False) -> JSONResponse:
    payload = rewrite_body(body, vision=vision)
    result = await backend_chat(payload)
    if result.status_code >= 400:
        return result
    data = json.loads(result.body)
    msg, content = message_content(data)
    if not msg.get("tool_calls"):
        data = fake_tool_call(payload, content or "Mình đây.")
    else:
        data = coerce_existing_tool_calls(payload, data)
    return JSONResponse(data)


@app.post("/api/v1/llm/chat/completions")
async def llm_chat(body: dict):
    return await proxy_chat(body, vision=False)


@app.post("/api/v1/companion/chat/completions")
async def companion_chat(body: dict):
    """llama3.2 mangles forced tool_choice; ask for plain text then wrap as `reply`."""
    simple = dict(body)
    simple.pop("tools", None)
    simple.pop("tool_choice", None)
    simple.pop("parallel_tool_calls", None)
    simple["messages"] = scrub_companion_messages(simple.get("messages") or [])
    simple["messages"] = list(simple["messages"]) + [{"role": "system", "content": TAIL_NUDGE}]
    payload = rewrite_body(simple, vision=False)
    result = await backend_chat(payload)
    if result.status_code >= 400:
        return result
    data = json.loads(result.body)
    msg, content = message_content(data)
    if msg.get("tool_calls"):
        return JSONResponse(coerce_existing_tool_calls({**body, "tool_choice": {"function": {"name": "reply"}}}, data))
    return JSONResponse(fake_tool_call({**body, "tool_choice": {"function": {"name": "reply"}}}, content or "Mình đây."))


@app.post("/api/v1/vision/chat/completions")
async def vision_chat(body: dict):
    messages = body.get("messages") or []
    result = await proxy_chat(body, vision=True)
    if result.status_code < 400:
        return result
    tab = ""
    for m in messages:
        c = m.get("content")
        if isinstance(c, list):
            for p in c:
                if isinstance(p, dict) and p.get("type") == "text":
                    tab = p.get("text") or tab
        elif isinstance(c, str) and not tab:
            tab = c
    text = (
        "Local vision model cannot read screenshots (llama3.2 is text-only). "
        "Use the numeric [index] list from browser_state instead."
    )
    if tab:
        text = f"{text} Page text: {tab[:800]}"
    log.warning("vision fallback after %s", result.status_code)
    return JSONResponse({
        "id": "chatcmpl-local-vision",
        "object": "chat.completion",
        "choices": [{"index": 0, "finish_reason": "stop", "message": {"role": "assistant", "content": text}}],
        "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
    })


@app.post("/api/v1/jev/systemone")
async def jev(body: dict):
    questions = body.get("questions") or {}
    state = body.get("state") or {}
    answers = {}
    blob = json.dumps(state, ensure_ascii=False).lower()
    taskish = bool(re.search(
        r"\b(search|click|open|go to|browse|find|google|mở|tìm|bấm|vào trang|navigate|fill|type|submit)\b",
        blob,
    ))
    pagish = bool(re.search(
        r"\b(this page|on (the|this) (page|screen|tab)|what's on|look at|màn hình|trang này|trang web)\b",
        blob,
    ))
    for name, q in questions.items():
        qtype = (q or {}).get("type")
        if qtype == "noul":
            p = 0.15
            if name in ("new_task",):
                p = 0.1
            elif name in ("browser_task",):
                p = 0.72 if taskish else 0.22
            elif name in ("about_page",):
                p = 0.7 if pagish else 0.15
            elif name in ("done",):
                p = 0.2
            elif name in ("blocked", "irreversible"):
                p = 0.05
            elif name == "ok":
                p = 0.95
            answers[name] = {"noul": p}
        elif qtype == "choice":
            raw_c = (q or {}).get("criteria") or {}
            criteria = list(raw_c.keys()) if isinstance(raw_c, dict) else list(raw_c or [])
            pick = criteria[0] if criteria else "none"
            if name == "action":
                if taskish and "click" in criteria:
                    pick = "click"
                elif "none" in criteria:
                    pick = "none"
            elif name in ("target", "value") and criteria:
                pick = criteria[0]
            probs = {k: (0.9 if k == pick else 0.1 / max(len(criteria) - 1, 1)) for k in criteria} or {pick: 1.0}
            answers[name] = {"choice": pick, "probabilities": probs}
        else:
            answers[name] = {"noul": 0.0}
    return {"answers": answers, "usage": {"input_tokens": 0}}


@app.post("/api/v1/realtime/speech/session")
@app.post("/api/v1/realtime/stream/session")
async def mint_speech(body: dict | None = None):
    body = body or {}
    kind = body.get("kind") or "tts"
    if kind not in ("tts", "stt"):
        kind = "tts"
    voice_id = body.get("voice_id") or "local"
    provider = (body.get("voice_provider") or local_speech.provider_for(voice_id, PERSONAS) or "minimax").lower()
    rec = load_settings()
    # Original Cartesia/Minimax clones: mint on api.zeroweight.ai, return their wss URL.
    # The CRX already decodes cartesia as pcm_f32le @ 44100 and minimax as mp3.
    # STT stays local so the free plan's single concurrent socket is free for TTS.
    if rec.get("tts_gateway") == "zeroweight" and kind == "tts":
        key = zw_developer_key()
        if not key:
            return JSONResponse(
                {"error": {"message": "Original voices need ZW_KEY or server/data/zw_key.txt"}},
                status_code=401,
            )
        payload = {
            "kind": "tts",
            "sample_rate": body.get("sample_rate") or 24000,
            "voice_id": voice_id,
            "voice_provider": provider if provider in ("cartesia", "minimax") else "cartesia",
        }
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                r = await client.post(
                    f"{ZW_API}/realtime/speech/session",
                    headers={"X-ZW-Api-Key": key, "Content-Type": "application/json"},
                    json=payload,
                )
        except httpx.RequestError as e:
            return JSONResponse({"error": {"message": f"ZeroWeight speech unreachable: {e}"}}, status_code=502)
        try:
            data = r.json()
        except Exception:
            data = {"error": {"message": r.text[:300]}}
        if r.status_code >= 400 or not (isinstance(data, dict) and data.get("url")):
            msg = (data.get("error") or {}).get("message") if isinstance(data, dict) else str(data)
            if not msg and isinstance(data, dict):
                msg = data.get("detail") or r.text[:300]
            return JSONResponse(
                {"error": {"message": msg or f"ZeroWeight speech mint {r.status_code}"}},
                status_code=r.status_code if r.status_code >= 400 else 502,
            )
        data["gateway"] = "zeroweight"
        return data
    qs = ""
    if kind == "stt" and body.get("language"):
        qs = f"?language={body['language']}"
    url = f"ws://{HOST}:{PORT}/speech/{kind}{qs}"
    return {
        "url": url,
        "kind": kind,
        "expires_in_seconds": 600,
        "expires_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() + 600)),
        "max_concurrent_sessions": 8,
        "service": "local",
        "credits_per_second": 0,
        "minimum_credits": 0,
        "voice_id": voice_id,
        "voice_provider": provider,
        "sample_rate": body.get("sample_rate") or (16000 if kind == "stt" else 24000),
        "gateway": "local",
        "protocol": "zerotts.v1",
        "format": "pcm_f32le" if provider == "cartesia" else "mp3",
    }


@app.get("/api/v1/chat/speech-config")
def speech_config():
    return {"speech_api_url": PUBLIC}


@app.get("/api/v1/voices/system")
@app.get("/api/v1/voices/public")
def list_voices():
    return local_speech.list_system_voices()


@app.get("/api/v1/voices/clone")
def list_clone_voices():
    return []


@app.get("/api/v1/livekit/getToken")
def livekit():
    return JSONResponse({"detail": "LiveKit not served locally"}, status_code=501)


@app.websocket("/speech/{kind}")
async def speech_socket(ws: WebSocket, kind: str):
    await ws.accept()
    if kind == "stt":
        await ws.send_text(json.dumps({"type": "ready"}))
        pcm = bytearray()
        keywords = ws.query_params.getlist("keywords")
        language = ws.query_params.get("language")
        try:
            while True:
                msg = await ws.receive()
                if msg.get("type") == "websocket.disconnect":
                    break
                if msg.get("bytes"):
                    pcm.extend(msg["bytes"])
                    continue
                text = msg.get("text") or ""
                try:
                    payload = json.loads(text)
                except Exception:
                    continue
                if payload.get("type") == "end_of_speech":
                    prompt = " ".join(keywords) if keywords else None
                    try:
                        transcript = await asyncio.to_thread(
                            local_speech.transcribe_pcm16,
                            bytes(pcm),
                            language,
                            prompt,
                        )
                    except Exception as e:
                        await ws.send_text(json.dumps({"type": "error", "message": str(e)}))
                        break
                    await ws.send_text(json.dumps({"type": "interim", "text": transcript}))
                    await ws.send_text(json.dumps({"type": "final", "text": transcript}))
                    await ws.send_text(json.dumps({"type": "done", "text": transcript}))
                    break
                if payload.get("type") == "cancel":
                    break
        except WebSocketDisconnect:
            return
        return

    # tts: client sends {voice_id, text}. Cartesia = pcm_f32le@44100; minimax = mp3.
    try:
        while True:
            raw = await ws.receive_text()
            try:
                req = json.loads(raw)
            except Exception:
                await ws.send_text(json.dumps({"type": "error", "message": "bad json"}))
                continue
            spoken = (req.get("text") or "").strip()
            voice_id = req.get("voice_id")
            provider = local_speech.provider_for(voice_id, PERSONAS)
            audio, _fmt = await local_speech.synthesise(
                spoken, voice_id=voice_id, provider=provider
            )
            step = 32_768
            for i in range(0, len(audio), step):
                await ws.send_bytes(audio[i : i + step])
            await ws.send_text(json.dumps({"type": "done"}))
    except WebSocketDisconnect:
        return


@app.get("/api/v1/codex/models")
def codex_models():
    if not codex_llm.logged_in():
        return JSONResponse(
            {"error": {"message": "Codex is not logged in. Run `codex login` on this PC."}},
            status_code=401,
        )
    return codex_llm.list_models_openai()


@app.post("/api/v1/codex/chat/completions")
async def codex_chat(body: dict):
    if not codex_llm.logged_in():
        return JSONResponse(
            {"error": {"message": "Codex is not logged in. Run `codex login` on this PC."}},
            status_code=401,
        )
    name = tool_name_from(body)
    log.info("codex_chat name=%s tools=%s", name, bool(body.get("tools") or body.get("tool_choice")))
    # Extension verifyLLM forces `confirm` with {ok:true}. Do not round-trip
    # ChatGPT, and do not inject the companion [OUTPUT] scrub into that prompt.
    if is_confirm_request(body):
        return JSONResponse(fake_tool_call({**body, "tool_choice": {"function": {"name": "confirm"}}}, "ok"))
    payload = dict(body)
    payload.pop("tools", None)
    payload.pop("tool_choice", None)
    payload.pop("parallel_tool_calls", None)
    payload.pop("reasoning_effort", None)
    payload.pop("verbosity", None)
    if name == "reply":
        payload["messages"] = scrub_companion_messages(payload.get("messages") or [])
    elif name == "AgentOutput":
        msgs = list(payload.get("messages") or [])
        msgs.append({"role": "system", "content": AGENT_OUTPUT_NUDGE})
        payload["messages"] = msgs
    try:
        data = await codex_llm.chat_completions(payload)
    except Exception as e:
        log.exception("codex chat failed")
        if body.get("tools") or body.get("tool_choice"):
            return JSONResponse(fake_tool_call(body, "Mình đây."))
        return JSONResponse({"error": {"message": str(e)}}, status_code=502)
    if body.get("tools") or body.get("tool_choice"):
        _, content = message_content(data)
        return JSONResponse(fake_tool_call(body, content or "Mình đây."))
    return JSONResponse(data)


@app.get("/api/v1/local/settings")
def get_settings():
    rec = load_settings()
    rec["codex"] = codex_llm.status()
    rec["ollama"] = {"base": LLM_BASE, "model": LLM_MODEL}
    return rec


@app.put("/api/v1/local/settings")
@app.post("/api/v1/local/settings")
async def put_settings(body: dict):
    rec = save_settings(body or {})
    rec["codex"] = codex_llm.status()
    rec["ollama"] = {"base": LLM_BASE, "model": LLM_MODEL}
    return rec


async def list_ollama_models() -> list[dict]:
    base = LLM_BASE[:-3] if LLM_BASE.endswith("/v1") else LLM_BASE
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            r = await client.get(f"{base}/api/tags")
        rows = []
        for m in (r.json().get("models") or []):
            name = m.get("name") or m.get("model")
            if name:
                rows.append({
                    "id": name,
                    "size": m.get("size"),
                    "details": (m.get("details") or {}).get("parameter_size"),
                })
        return rows
    except Exception:
        return []


def persona_rows() -> list[dict]:
    rows = []
    for pid, p in PERSONAS.items():
        vid = p.get("voice_id") or pid
        info = local_speech.voice_info(vid)
        rows.append({
            "avatar_id": pid,
            "name": p.get("display_name") or p.get("name") or pid,
            "voice_id": vid,
            "edge": info.get("edge"),
            "engine": info.get("engine") or "auto",
            "provider": info.get("provider"),
            "label": info.get("label"),
        })
    rows.sort(key=lambda r: (r["name"] or "").lower())
    return rows


@app.get("/api/v1/local/catalog")
async def local_catalog():
    rec = load_settings()
    ollama = await list_ollama_models()
    if rec.get("ollama_model") and not any(x["id"] == rec["ollama_model"] or x["id"].startswith(rec["ollama_model"] + ":") for x in ollama):
        ollama.insert(0, {"id": rec["ollama_model"]})
    return {
        "settings": rec,
        "ollama_models": ollama,
        "codex_models": codex_llm.list_model_ids(),
        "codex": codex_llm.status(),
        "edge_voices": local_speech.EDGE_CATALOG,
        "personas": persona_rows(),
        "ollama_base": LLM_BASE,
        "speech": {
            "gateway": rec.get("tts_gateway") or "local",
            "original_available": bool(zw_developer_key()),
            "zerotts": local_speech.zerotts_status(),
        },
    }


@app.post("/api/v1/local/tts-preview")
async def tts_preview(body: dict | None = None):
    body = body or {}
    text = (body.get("text") or "Xin chào, đây là giọng thử.").strip()
    edge = body.get("edge")
    engine = (body.get("engine") or "edge").lower()
    if str(edge or "").startswith("zerotts"):
        engine = "zerotts"
    elif str(edge or "").startswith("gtts"):
        engine = "gtts"
    try:
        audio, fmt = await local_speech.synthesise(
            text,
            voice_id=body.get("voice_id"),
            provider="minimax",
            edge=edge,
            engine=engine,
            strict=True,
        )
    except Exception as e:
        return JSONResponse({"error": {"message": str(e)}}, status_code=502)
    if not audio or fmt in ("pcm_f32le",) and local_speech.pcm_f32_peak(audio) < 1e-4:
        return JSONResponse({"error": {"message": "Giọng này không ra audio (Microsoft vi-VN đang lỗi)."}}, status_code=502)
    if fmt == "wav" and len(audio) < 1000:
        return JSONResponse({"error": {"message": "Giọng này không ra audio."}}, status_code=502)
    media = "audio/mpeg" if fmt == "mp3" else "audio/wav"
    return Response(content=audio, media_type=media, headers={"Cache-Control": "no-store"})


@app.get("/voices")
def voices_lab():
    path = STATIC / "voice-lab.html"
    if path.exists():
        return FileResponse(path, headers={"Cache-Control": "no-store"})
    return HTMLResponse("<p>voice-lab.html missing</p>", status_code=500)


@app.get("/settings")
def settings_page():
    path = STATIC / "settings.html"
    if path.exists():
        return FileResponse(path, headers={"Cache-Control": "no-store"})
    return HTMLResponse("<p>settings.html missing</p>", status_code=500)


@app.get("/healthz")
def healthz():
    rec = load_settings()
    return {
        "ok": True,
        "llm": LLM_BASE,
        "model": active_llm_model(),
        "backend": rec.get("llm_backend"),
        "ollama_model": rec.get("ollama_model"),
        "codex": rec.get("codex_model") if rec.get("llm_backend") == "codex" else None,
        "codex_logged_in": codex_llm.logged_in(),
        "tts_gateway": rec.get("tts_gateway") or "local",
        "original_voices": bool(zw_developer_key()),
        "zerotts": local_speech.zerotts_status(),
    }


@app.get("/stage", response_class=HTMLResponse)
def stage():
    return """<!doctype html>
<html><head>
<meta charset="utf-8">
<title>Waifu Agent — local stage</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  html, body { margin: 0; height: 100%; background:
    radial-gradient(1200px 600px at 70% 10%, #3a2430 0%, #1a1218 55%, #120c10 100%);
    color: #f4e9e1; font: 14px/1.45 system-ui, sans-serif; overflow: hidden; }
  .hint { position: fixed; left: 24px; top: 20px; z-index: 1; max-width: 360px;
    opacity: .72; pointer-events: none; }
  .hint h1 { font-size: 18px; font-weight: 600; margin: 0 0 8px; }
  .hint p { margin: 0; }
</style>
</head>
<body>
  <div class="hint">
    <h1>Local stage</h1>
    <p>This page is the overlay host. She appears bottom-right after the side panel reloads the extension.</p>
    <p style="margin-top:8px"><a href="/settings" style="color:#e8b4a2">Cài đặt model AI &amp; giọng</a></p>
  </div>
</body></html>"""


@app.get("/preview", response_class=HTMLResponse)
def preview():
    cards = []
    for a in AVATARS:
        src = local_image(a["id"])
        cards.append(
            f'<figure><img src="{src}" alt="{a["name"]}"><figcaption>{a["name"]}</figcaption></figure>'
        )
    return f"""<!doctype html>
<html><head><meta charset="utf-8"><title>local avatars</title>
<style>
body{{margin:0;background:#1a1218;color:#f4e9e1;font:14px/1.4 system-ui;padding:24px}}
h1{{font-weight:600;margin:0 0 16px}}
grid,section{{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px}}
figure{{margin:0;background:#2a1c24;border-radius:16px;padding:12px 12px 8px;text-align:center}}
img{{width:100%;height:240px;object-fit:contain;object-position:bottom;filter:drop-shadow(0 8px 16px rgba(0,0,0,.45))}}
figcaption{{margin-top:8px;opacity:.85}}
</style></head>
<body>
<h1>Waifu Agent local — 9 system covers</h1>
<section>{''.join(cards)}</section>
</body></html>"""


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host=HOST, port=PORT, reload=False)
