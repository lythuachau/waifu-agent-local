"""User overlays: persona edits, prefs, chat sessions. Lives on the Docker volume."""
from __future__ import annotations

import json
import re
import threading
from pathlib import Path

DATA = Path(__file__).resolve().parent / "data"
USER = DATA / "user"
PERSONAS = USER / "personas"
SESSIONS = USER / "sessions"
PREFS_PATH = USER / "prefs.json"
SHORTCUTS_PATH = USER / "shortcuts.json"

DEFAULT_SHORTCUTS = [
    {"id": "tom", "trigger": "tóm", "prompt": "Tóm tắt nội dung các tab/trang đã gắn hoặc trang đang mở."},
    {"id": "doc", "trigger": "đọc", "prompt": "Đọc N chương liên tục từ trang truyện đang mở. Nếu user ghi số sau lệnh thì N là số đó, không thì hỏi."},
    {"id": "luot", "trigger": "lướt", "prompt": "Scroll xuống tối đa 2 lần rồi dừng. Không lướt đến max steps."},
    {"id": "dich", "trigger": "dịch", "prompt": "Dịch sang tiếng Việt đoạn đã chọn hoặc dump trang đang mở."},
    {"id": "so", "trigger": "so", "prompt": "So sánh các tab đang gắn bằng @."},
]
_SAFE = re.compile(r"[^A-Za-z0-9._-]+")
_locks: dict[str, threading.Lock] = {}
_map = threading.Lock()

STAGES = [
    "stranger",
    "acquaintance",
    "friend",
    "close_friend",
    "best_friend",
    "crush",
    "lover",
    "soulmate",
]
MODES = ["chat", "romance", "roleplay"]


def _aid(avatar_id: str) -> str:
    return (_SAFE.sub("", str(avatar_id or "").strip()) or "default")[:80]


def _lock(name: str) -> threading.Lock:
    with _map:
        lock = _locks.get(name)
        if lock is None:
            lock = threading.Lock()
            _locks[name] = lock
        return lock


def _read(path: Path, default):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def load_persona(avatar_id: str) -> dict:
    aid = _aid(avatar_id)
    PERSONAS.mkdir(parents=True, exist_ok=True)
    rec = _read(PERSONAS / f"{aid}.json", {})
    return rec if isinstance(rec, dict) else {}


def save_persona(avatar_id: str, body: dict) -> dict:
    aid = _aid(avatar_id)
    PERSONAS.mkdir(parents=True, exist_ok=True)
    cur = load_persona(aid)
    for k in ("display_name", "persona_prompt", "persona_knowledge", "relationship_stage", "chat_mode"):
        if k in (body or {}):
            val = body[k]
            if k == "relationship_stage" and val not in STAGES:
                continue
            if k == "chat_mode" and val not in MODES:
                continue
            cur[k] = val
    with _lock("p:" + aid):
        (PERSONAS / f"{aid}.json").write_text(json.dumps(cur, ensure_ascii=False, indent=2), encoding="utf-8")
    return cur


def _norm_shortcut(item) -> dict | None:
    if not isinstance(item, dict):
        return None
    trigger = re.sub(r"^/+", "", str(item.get("trigger") or "").strip())[:40]
    prompt = str(item.get("prompt") or "").strip()[:4000]
    if not trigger or not prompt:
        return None
    sid = _aid(str(item.get("id") or trigger))
    return {"id": sid, "trigger": trigger, "prompt": prompt}


def load_shortcuts() -> list:
    rec = _read(SHORTCUTS_PATH, None)
    if isinstance(rec, dict) and isinstance(rec.get("shortcuts"), list):
        items = rec["shortcuts"]
    elif isinstance(rec, list):
        items = rec
    else:
        items = DEFAULT_SHORTCUTS
    out = []
    seen = set()
    for raw in items:
        item = _norm_shortcut(raw)
        if not item or item["id"] in seen:
            continue
        seen.add(item["id"])
        out.append(item)
    return out or list(DEFAULT_SHORTCUTS)


def save_shortcuts(body) -> list:
    items = body.get("shortcuts") if isinstance(body, dict) else body
    if not isinstance(items, list):
        items = load_shortcuts()
    out = []
    seen = set()
    for raw in items:
        item = _norm_shortcut(raw)
        if not item or item["id"] in seen:
            continue
        seen.add(item["id"])
        out.append(item)
    USER.mkdir(parents=True, exist_ok=True)
    with _lock("shortcuts"):
        SHORTCUTS_PATH.write_text(json.dumps({"shortcuts": out}, ensure_ascii=False, indent=2), encoding="utf-8")
    return out


def load_prefs() -> dict:
    rec = _read(PREFS_PATH, {})
    return rec if isinstance(rec, dict) else {}


def save_prefs(body: dict) -> dict:
    cur = load_prefs()
    if isinstance(body, dict):
        if isinstance(body.get("characterPrefs"), dict):
            base = cur.get("characterPrefs")
            if not isinstance(base, dict):
                base = {}
            cur["characterPrefs"] = {**base, **body["characterPrefs"]}
        if "language" in body:
            cur["language"] = body["language"]
    USER.mkdir(parents=True, exist_ok=True)
    with _lock("prefs"):
        PREFS_PATH.write_text(json.dumps(cur, ensure_ascii=False, indent=2), encoding="utf-8")
    return cur


def list_sessions() -> list:
    SESSIONS.mkdir(parents=True, exist_ok=True)
    out = []
    for p in SESSIONS.glob("*.json"):
        rec = _read(p, None)
        if isinstance(rec, dict) and rec.get("id"):
            out.append(rec)
    out.sort(key=lambda r: r.get("createdAt") or 0, reverse=True)
    return out


def save_session(chat_id: str, body: dict) -> dict:
    cid = _aid(chat_id)
    SESSIONS.mkdir(parents=True, exist_ok=True)
    rec = dict(body or {})
    rec["id"] = rec.get("id") or cid
    with _lock("s:" + cid):
        (SESSIONS / f"{cid}.json").write_text(json.dumps(rec, ensure_ascii=False), encoding="utf-8")
    return rec


def get_session(chat_id: str) -> dict | None:
    p = SESSIONS / f"{_aid(chat_id)}.json"
    rec = _read(p, None)
    return rec if isinstance(rec, dict) else None


def delete_session(chat_id: str) -> None:
    p = SESSIONS / f"{_aid(chat_id)}.json"
    with _lock("s:" + _aid(chat_id)):
        if p.exists():
            p.unlink()


def delete_all_sessions() -> int:
    SESSIONS.mkdir(parents=True, exist_ok=True)
    n = 0
    for p in list(SESSIONS.glob("*.json")):
        with _lock("s:" + p.stem):
            if p.exists():
                p.unlink()
                n += 1
    return n
