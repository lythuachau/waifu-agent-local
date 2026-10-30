"""ChatGPT / Codex CLI login as an OpenAI-compatible chat backend.

Uses the machine's `~/.codex/auth.json` (ChatGPT OAuth from `codex login`)
against `https://chatgpt.com/backend-api/codex/responses`. Tokens never leave
this process in logs.
"""
from __future__ import annotations

import base64
import json
import logging
import threading
import time
import uuid
from pathlib import Path

import httpx

log = logging.getLogger("codex_llm")

AUTH_PATH = Path.home() / ".codex" / "auth.json"
MODELS_CACHE = Path.home() / ".codex" / "models_cache.json"
# Real Codex CLI 0.162 client_id (from the installed rust binary), not the
# client-metadata URL. Refresh with the URL as client_id returns 401.
CLIENT_ID = "app_EMoamEEZ73f0CkXaXp7hrann"
TOKEN_URL = "https://auth.openai.com/oauth/token"
ISSUER = "https://auth.openai.com"
DEVICE_API = f"{ISSUER}/api/accounts"
DEVICE_PAGE = f"{ISSUER}/codex/device"
DEVICE_CALLBACK = f"{ISSUER}/deviceauth/callback"
RESPONSES_URL = "https://chatgpt.com/backend-api/codex/responses"
DEFAULT_MODEL = "gpt-6-luna"
REFRESH_SKEW_SEC = 60
_AUTH_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "originator": "codex_cli_rs",
}

_login_lock = threading.Lock()
_login_pending: dict | None = None
_last_ping: dict | None = None


def _read_auth() -> dict:
    if not AUTH_PATH.exists():
        return {}
    try:
        return json.loads(AUTH_PATH.read_text(encoding="utf-8"))
    except Exception:
        return {}


def logged_in() -> bool:
    tokens = (_read_auth().get("tokens") or {})
    return bool(tokens.get("access_token"))


def _jwt_claims(token: str) -> dict:
    try:
        payload = token.split(".")[1]
        payload += "=" * (-len(payload) % 4)
        data = json.loads(base64.urlsafe_b64decode(payload.encode("ascii")))
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def _mask_email(email: str) -> str:
    email = (email or "").strip()
    if "@" not in email:
        return ""
    local, _, domain = email.partition("@")
    if len(local) <= 1:
        return f"*@{domain}"
    return f"{local[0]}***@{domain}"


def status() -> dict:
    auth = _read_auth()
    tokens = auth.get("tokens") or {}
    access = tokens.get("access_token") or ""
    claims = _jwt_claims(tokens.get("id_token") or "")
    extra = claims.get("https://api.openai.com/auth") or {}
    if not isinstance(extra, dict):
        extra = {}
    exp = _jwt_exp(access)
    remaining = int(exp - time.time()) if exp else None
    fresh = _access_fresh(tokens) if access else False
    logged = bool(access)
    ping = dict(_last_ping) if _last_ping else None
    pending = False
    with _login_lock:
        pending = bool(_login_pending)
    if logged and ping and ping.get("ok"):
        label = "Codex đang hoạt động"
        state = "ok"
    elif logged and not fresh:
        label = "Codex token hết hạn — đăng nhập lại"
        state = "stale"
    elif logged:
        label = "Codex đã login (chưa kiểm tra)"
        state = "logged_in"
    else:
        label = "Codex chưa login"
        state = "logged_out"
    return {
        "logged_in": logged,
        "ready": bool(logged and fresh),
        "state": state,
        "label": label,
        "auth_mode": auth.get("auth_mode") or "",
        "has_account": bool(tokens.get("account_id")),
        "plan": str(extra.get("chatgpt_plan_type") or ""),
        "email": _mask_email(str(claims.get("email") or "")),
        "token_fresh": fresh,
        "expires_in_sec": remaining if remaining and remaining > 0 else 0,
        "default_model": DEFAULT_MODEL,
        "models": list_model_ids(),
        "last_ping": ping,
        "login_pending": pending,
    }


def list_model_ids() -> list[str]:
    ids: list[str] = []
    if MODELS_CACHE.exists():
        try:
            raw = json.loads(MODELS_CACHE.read_text(encoding="utf-8"))
            for rec in raw.get("models") or []:
                slug = rec.get("slug") or rec.get("id")
                if slug:
                    ids.append(slug)
        except Exception:
            pass
    if DEFAULT_MODEL not in ids:
        ids.insert(0, DEFAULT_MODEL)
    return ids or [DEFAULT_MODEL]


def list_models_openai() -> dict:
    return {
        "object": "list",
        "data": [{"id": mid, "object": "model", "owned_by": "codex"} for mid in list_model_ids()],
    }


def _jwt_exp(access: str) -> int | None:
    try:
        data = _jwt_claims(access)
        return int(data.get("exp") or 0) or None
    except Exception:
        return None


def _access_fresh(tokens: dict) -> bool:
    access = tokens.get("access_token") or ""
    if not access:
        return False
    exp = _jwt_exp(access)
    if not exp:
        return True
    return exp > time.time() + REFRESH_SKEW_SEC


async def _refresh(auth: dict) -> dict:
    tokens = dict(auth.get("tokens") or {})
    if _access_fresh(tokens):
        return auth
    refresh = tokens.get("refresh_token")
    if not refresh:
        return auth
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.post(
                TOKEN_URL,
                data={
                    "grant_type": "refresh_token",
                    "refresh_token": refresh,
                    "client_id": CLIENT_ID,
                    "scope": "openid profile email",
                },
                headers={"originator": "codex_cli_rs"},
            )
    except httpx.RequestError as e:
        log.warning("codex token refresh network: %s", e)
        return auth
    if r.status_code != 200:
        log.warning("codex token refresh status %s body %s", r.status_code, r.text[:180])
        return auth
    try:
        body = r.json()
    except Exception:
        return auth
    if body.get("access_token"):
        tokens["access_token"] = body["access_token"]
    if body.get("refresh_token"):
        tokens["refresh_token"] = body["refresh_token"]
    if body.get("id_token"):
        tokens["id_token"] = body["id_token"]
    if body.get("account_id"):
        tokens["account_id"] = body["account_id"]
    auth = dict(auth)
    auth["tokens"] = tokens
    try:
        AUTH_PATH.write_text(json.dumps(auth, indent=2), encoding="utf-8")
    except Exception as e:
        log.warning("could not write refreshed auth.json: %s", e)
    return auth


def _headers(auth: dict) -> dict:
    tokens = auth.get("tokens") or {}
    access = tokens.get("access_token") or ""
    headers = {
        "Authorization": f"Bearer {access}",
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
        "OpenAI-Beta": "responses=experimental",
        "originator": "codex_cli_rs",
        "session_id": str(uuid.uuid4()),
        "version": "0.162.1",
    }
    account = tokens.get("account_id")
    if account:
        headers["chatgpt-account-id"] = account
    return headers


def _flatten_content(content) -> list[dict]:
    if isinstance(content, str):
        return [{"type": "input_text", "text": content}]
    parts: list[dict] = []
    if isinstance(content, list):
        for p in content:
            if isinstance(p, str) and p.strip():
                parts.append({"type": "input_text", "text": p})
                continue
            if not isinstance(p, dict):
                continue
            typ = p.get("type")
            if typ in ("text", None) and p.get("text"):
                parts.append({"type": "input_text", "text": str(p.get("text") or "")})
            elif typ in ("image_url", "image"):
                url = p.get("image_url")
                if isinstance(url, dict):
                    url = url.get("url")
                if url:
                    parts.append({"type": "input_image", "image_url": url})
    return parts or [{"type": "input_text", "text": ""}]


def to_payload(messages: list, model: str) -> dict:
    instructions: list[str] = []
    items: list[dict] = []
    for m in messages or []:
        role = (m.get("role") or "user").lower()
        parts = _flatten_content(m.get("content"))
        text = "\n".join(p.get("text") or "" for p in parts if p.get("type") == "input_text").strip()
        if role == "system":
            if text:
                instructions.append(text)
            continue
        if role == "assistant":
            items.append({
                "role": "assistant",
                "content": [{"type": "output_text", "text": text}],
            })
            continue
        items.append({"role": "user", "content": parts})
    return {
        "model": model or DEFAULT_MODEL,
        "instructions": "\n\n".join(instructions)
        or "You are a live chat companion. Reply in the user's language. Short sentences.",
        "input": items or [{"role": "user", "content": [{"type": "input_text", "text": "hello"}]}],
        "store": False,
        "stream": True,
        "tools": [],
    }


def _delta_text(delta) -> str:
    if isinstance(delta, str):
        return delta
    if isinstance(delta, dict):
        return str(delta.get("text") or delta.get("content") or "")
    return ""


def _message_text_from_response(data: dict) -> str:
    texts: list[str] = []
    for item in ((data.get("response") or {}).get("output") or []):
        if item.get("type") not in ("message", "output_text"):
            continue
        for part in item.get("content") or []:
            if not isinstance(part, dict):
                continue
            if part.get("type") in ("output_text", "text") and part.get("text"):
                texts.append(str(part["text"]))
        if item.get("text"):
            texts.append(str(item["text"]))
    return "\n".join(t for t in texts if t).strip()


def _text_from_sse_line(line: str, buf: list[str]) -> str | None:
    line = (line or "").strip()
    if not line.startswith("data:"):
        return None
    raw = line[5:].strip()
    if not raw or raw == "[DONE]":
        return None
    try:
        data = json.loads(raw)
    except Exception:
        return None
    typ = data.get("type")
    if typ in ("response.failed", "error", "response.error"):
        err = data.get("error") or data.get("message") or data
        raise RuntimeError(f"Codex stream error: {err}")
    if typ == "response.output_text.delta":
        piece = _delta_text(data.get("delta"))
        if piece:
            buf.append(piece)
        return None
    if typ == "response.output_text.done" and data.get("text"):
        return str(data["text"])
    if typ == "response.completed":
        return _message_text_from_response(data) or None
    return None


async def complete(messages: list, model: str | None = None) -> str:
    if not logged_in():
        raise RuntimeError("Codex is not logged in. Run `codex login` on this PC.")
    auth = await _refresh(_read_auth())
    payload = to_payload(messages, model or DEFAULT_MODEL)
    buf: list[str] = []
    full = ""
    async with httpx.AsyncClient(timeout=180.0) as client:
        async with client.stream("POST", RESPONSES_URL, headers=_headers(auth), json=payload) as r:
            if r.status_code >= 400:
                err = (await r.aread())[:400].decode("utf-8", "replace")
                raise RuntimeError(f"Codex HTTP {r.status_code}: {err}")
            async for line in r.aiter_lines():
                done = _text_from_sse_line(line, buf)
                if done:
                    full = done
    text = (full or "".join(buf)).strip()
    if not text:
        log.warning("codex empty reply for model %s", payload.get("model"))
        return "Mình đây."
    return text


def as_chat_completion(text: str, model: str) -> dict:
    return {
        "id": "chatcmpl-codex",
        "object": "chat.completion",
        "model": model,
        "choices": [{
            "index": 0,
            "finish_reason": "stop",
            "message": {"role": "assistant", "content": text},
        }],
        "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
    }


async def chat_completions(body: dict) -> dict:
    model = body.get("model") or DEFAULT_MODEL
    if model in ("zeroweight", "llama3.2", ""):
        model = DEFAULT_MODEL
    text = await complete(body.get("messages") or [], model)
    return as_chat_completion(text, model)


async def ping(model: str | None = None) -> dict:
    global _last_ping
    model = model or DEFAULT_MODEL
    if model in ("zeroweight", "llama3.2", ""):
        model = DEFAULT_MODEL
    t0 = time.perf_counter()
    if not logged_in():
        rec = {
            "ok": False,
            "error": "Chưa login Codex.",
            "ms": 0,
            "model": model,
            "reply": "",
        }
        _last_ping = rec
        return rec
    try:
        text = await complete(
            [{"role": "user", "content": "Reply with the single word pong."}],
            model,
        )
        rec = {
            "ok": True,
            "error": "",
            "ms": int((time.perf_counter() - t0) * 1000),
            "model": model,
            "reply": (text or "")[:80],
        }
    except Exception as e:
        rec = {
            "ok": False,
            "error": str(e)[:300],
            "ms": int((time.perf_counter() - t0) * 1000),
            "model": model,
            "reply": "",
        }
        log.warning("codex ping failed: %s", rec["error"])
    _last_ping = rec
    return rec


def _account_id_from_id_token(id_token: str) -> str:
    claims = _jwt_claims(id_token)
    extra = claims.get("https://api.openai.com/auth") or {}
    if isinstance(extra, dict) and extra.get("chatgpt_account_id"):
        return str(extra["chatgpt_account_id"])
    return ""


def _persist_tokens(access: str, refresh: str, id_token: str, account_id: str = "") -> None:
    AUTH_PATH.parent.mkdir(parents=True, exist_ok=True)
    auth = _read_auth()
    tokens = dict(auth.get("tokens") or {})
    tokens["access_token"] = access
    if refresh:
        tokens["refresh_token"] = refresh
    if id_token:
        tokens["id_token"] = id_token
    tokens["account_id"] = account_id or _account_id_from_id_token(id_token) or tokens.get("account_id") or ""
    auth["tokens"] = tokens
    auth["auth_mode"] = "chatgpt"
    auth["last_refresh"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    AUTH_PATH.write_text(json.dumps(auth, indent=2), encoding="utf-8")


def logout() -> dict:
    global _last_ping, _login_pending
    auth = _read_auth()
    auth["tokens"] = {}
    auth["auth_mode"] = ""
    try:
        AUTH_PATH.parent.mkdir(parents=True, exist_ok=True)
        AUTH_PATH.write_text(json.dumps(auth, indent=2), encoding="utf-8")
    except Exception as e:
        return {"ok": False, "error": str(e)[:200]}
    _last_ping = None
    with _login_lock:
        _login_pending = None
    return {"ok": True, **status()}


async def login_start() -> dict:
    global _login_pending
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.post(
            f"{DEVICE_API}/deviceauth/usercode",
            headers=_AUTH_HEADERS,
            json={"client_id": CLIENT_ID},
        )
    if r.status_code == 404:
        return {
            "ok": False,
            "error": "Device code chưa bật. ChatGPT → Settings → Security → Device code authorization.",
        }
    if r.status_code >= 400:
        return {"ok": False, "error": f"Không xin được mã login ({r.status_code})."}
    try:
        body = r.json()
    except Exception:
        return {"ok": False, "error": "Phản hồi login không đọc được."}
    user_code = body.get("user_code") or body.get("usercode") or ""
    device_auth_id = body.get("device_auth_id") or ""
    interval = body.get("interval") or 5
    try:
        interval = int(interval)
    except Exception:
        interval = 5
    if not user_code or not device_auth_id:
        return {"ok": False, "error": "Server không trả mã thiết bị."}
    rec = {
        "device_auth_id": device_auth_id,
        "user_code": user_code,
        "interval": max(2, interval),
        "started": time.time(),
    }
    with _login_lock:
        _login_pending = rec
    return {
        "ok": True,
        "pending": True,
        "user_code": user_code,
        "verification_url": DEVICE_PAGE,
        "expires_in": 15 * 60,
        "interval": rec["interval"],
    }


async def login_poll() -> dict:
    global _login_pending, _last_ping
    with _login_lock:
        pending = dict(_login_pending) if _login_pending else None
    if not pending:
        return {"ok": False, "pending": False, "error": "Chưa bấm Đăng nhập Codex."}
    if time.time() - pending["started"] > 15 * 60:
        with _login_lock:
            _login_pending = None
        return {"ok": False, "pending": False, "error": "Mã hết hạn (15 phút). Bấm Đăng nhập lại."}
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.post(
            f"{DEVICE_API}/deviceauth/token",
            headers=_AUTH_HEADERS,
            json={
                "device_auth_id": pending["device_auth_id"],
                "user_code": pending["user_code"],
            },
        )
    if r.status_code in (403, 404):
        return {"ok": False, "pending": True, "user_code": pending["user_code"], "verification_url": DEVICE_PAGE}
    if r.status_code >= 400:
        return {"ok": False, "pending": False, "error": f"Login thất bại ({r.status_code})."}
    try:
        body = r.json()
    except Exception:
        return {"ok": False, "pending": True}
    code = body.get("authorization_code") or ""
    verifier = body.get("code_verifier") or ""
    if not code or not verifier:
        return {"ok": False, "pending": True}
    async with httpx.AsyncClient(timeout=30.0) as client:
        tr = await client.post(
            TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "client_id": CLIENT_ID,
                "code": code,
                "code_verifier": verifier,
                "redirect_uri": DEVICE_CALLBACK,
            },
            headers={"originator": "codex_cli_rs"},
        )
    if tr.status_code >= 400:
        log.warning("codex device token exchange %s", tr.status_code)
        return {"ok": False, "pending": False, "error": f"Đổi mã lấy token lỗi ({tr.status_code})."}
    try:
        tokens = tr.json()
    except Exception:
        return {"ok": False, "pending": False, "error": "Token không đọc được."}
    access = tokens.get("access_token") or ""
    if not access:
        return {"ok": False, "pending": False, "error": "Không nhận được access_token."}
    try:
        _persist_tokens(
            access,
            tokens.get("refresh_token") or "",
            tokens.get("id_token") or "",
            str(tokens.get("account_id") or ""),
        )
    except Exception as e:
        return {"ok": False, "pending": False, "error": f"Không ghi được auth.json: {e}"}
    with _login_lock:
        _login_pending = None
    _last_ping = None
    log.info("codex device login saved")
    return {"ok": True, "pending": False, **status()}
