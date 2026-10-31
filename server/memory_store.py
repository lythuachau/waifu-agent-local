"""Companion long-term memory on disk (Docker volume), not chrome.storage."""
from __future__ import annotations

import json
import re
import threading
from pathlib import Path

DATA = Path(__file__).resolve().parent / "data"
USER_MEMORY = DATA / "user_memory"
_SAFE = re.compile(r"[^A-Za-z0-9._-]+")
_locks: dict[str, threading.Lock] = {}
_map_lock = threading.Lock()

EMPTY = {"longTerm": "", "pending": []}


def _aid(avatar_id: str) -> str:
    s = _SAFE.sub("", str(avatar_id or "").strip()) or "default"
    return s[:80]


def _lock(aid: str) -> threading.Lock:
    with _map_lock:
        lock = _locks.get(aid)
        if lock is None:
            lock = threading.Lock()
            _locks[aid] = lock
        return lock


def _path(aid: str) -> Path:
    USER_MEMORY.mkdir(parents=True, exist_ok=True)
    return USER_MEMORY / f"{aid}.json"


def load(avatar_id: str) -> dict:
    aid = _aid(avatar_id)
    with _lock(aid):
        p = _path(aid)
        if not p.exists():
            return {**EMPTY, "pending": []}
        try:
            rec = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            rec = {}
        pending = rec.get("pending") if isinstance(rec.get("pending"), list) else []
        return {
            "longTerm": str(rec.get("longTerm") or ""),
            "pending": pending,
            "updatedAt": rec.get("updatedAt"),
            "lastError": rec.get("lastError"),
        }


def save(avatar_id: str, body: dict) -> dict:
    aid = _aid(avatar_id)
    rec = {
        "longTerm": str((body or {}).get("longTerm") or ""),
        "pending": (body or {}).get("pending") if isinstance((body or {}).get("pending"), list) else [],
        "updatedAt": (body or {}).get("updatedAt"),
        "lastError": (body or {}).get("lastError"),
    }
    with _lock(aid):
        USER_MEMORY.mkdir(parents=True, exist_ok=True)
        _path(aid).write_text(json.dumps(rec, ensure_ascii=False, indent=2), encoding="utf-8")
    return rec


def delete(avatar_id: str) -> None:
    aid = _aid(avatar_id)
    with _lock(aid):
        p = _path(aid)
        if p.exists():
            p.unlink()


def delete_all() -> int:
    USER_MEMORY.mkdir(parents=True, exist_ok=True)
    n = 0
    for p in USER_MEMORY.glob("*.json"):
        aid = p.stem
        with _lock(aid):
            if p.exists():
                p.unlink()
                n += 1
    return n


def forget_chat(chat_id: str) -> int:
    if not chat_id:
        return 0
    USER_MEMORY.mkdir(parents=True, exist_ok=True)
    n = 0
    for p in list(USER_MEMORY.glob("*.json")):
        aid = p.stem
        with _lock(aid):
            try:
                rec = json.loads(p.read_text(encoding="utf-8"))
            except Exception:
                continue
            pending = rec.get("pending") if isinstance(rec.get("pending"), list) else []
            keep = [e for e in pending if not isinstance(e, dict) or e.get("chatId") != chat_id]
            if len(keep) == len(pending):
                continue
            rec["pending"] = keep
            p.write_text(json.dumps(rec, ensure_ascii=False, indent=2), encoding="utf-8")
            n += 1
    return n
