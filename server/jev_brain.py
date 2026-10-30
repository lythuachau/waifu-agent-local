"""Jev noul/choice brain: Codex → Ollama JSON → regex heuristic."""
from __future__ import annotations

import json
import logging
import re

log = logging.getLogger("jev_brain")

SWIPE_RE = re.compile(
    r"lướt|luot|swipe|cuộn|cuon|\bscroll\b|kéo xuống|keo xuong|video tiếp|next video|feed",
    re.I,
)
TASK_RE = re.compile(r"tìm|search|click|mở http|goto|go to|mua|điền|type |nhập|bấm", re.I)

LOCAL_PREFER = (
    "qwen2.5:14b",
    "qwen2.5:7b",
    "qwen2.5",
    "llama3.1:8b",
    "llama3.1",
    "mistral:7b",
    "gemma2:9b",
    "llama3.2:latest",
    "llama3.2",
)


def _is_ping(questions: dict) -> bool:
    names = [n for n in questions if n]
    return names == ["ok"] or (len(names) == 1 and names[0] == "ok")


def _criteria_keys(q: dict) -> list[str]:
    raw = (q or {}).get("criteria") or {}
    if isinstance(raw, dict):
        return [str(k) for k in raw.keys()]
    if isinstance(raw, list):
        return [str(k) for k in raw]
    return []


def _jev_pick_action(criteria: list[str], goal: str, taskish: bool) -> str:
    g = (goal or "").lower()
    if re.search(r"scroll(\s|_)*up|cuộn lên", g) and "scroll_up" in criteria:
        return "scroll_up"
    if re.search(r"scroll|cuộn|xuống dưới", g) and "scroll_down" in criteria:
        return "scroll_down"
    if re.search(r"\b(type|điền|nhập|gõ|fill|search for|tìm)\b", g) and "type" in criteria:
        return "type"
    if re.search(r"\b(select|dropdown|chọn option)\b", g) and "select" in criteria:
        return "select"
    if re.search(r"\b(enter|submit|gửi|press enter)\b", g) and "press_enter" in criteria:
        return "press_enter"
    if (taskish or g) and "click" in criteria:
        return "click"
    if "none" in criteria:
        return "none"
    return criteria[0] if criteria else "none"


def _jev_pick_target(criteria: list[str], elements: list, action: str) -> str:
    if not criteria:
        return "none"

    def html_of(idx: str) -> str:
        for el in elements:
            if str((el or {}).get("index")) == str(idx):
                return str((el or {}).get("html") or "")
        return ""

    want = None
    if action in ("type", "press_enter"):
        want = re.compile(r"<(input|textarea)\b|contenteditable", re.I)
    elif action == "select":
        want = re.compile(r"<select\b", re.I)
    if want:
        for idx in criteria:
            if want.search(html_of(idx)):
                return idx
    return criteria[0]


def swipe_only(text: str) -> bool:
    t = text or ""
    return bool(SWIPE_RE.search(t)) and not TASK_RE.search(t)


def _history_scrolls(task: dict) -> int:
    hist = task.get("history") if isinstance(task.get("history"), list) else []
    n = 0
    for h in hist:
        act = str((h or {}).get("action") or "").lower()
        if "scroll" in act:
            n += 1
    return n


def heuristic_jev(body: dict) -> dict:
    questions = body.get("questions") or {}
    state = body.get("state") or {}
    answers = {}
    blob = json.dumps(state, ensure_ascii=False).lower()
    task = state.get("task") if isinstance(state.get("task"), dict) else {}
    page = state.get("page") if isinstance(state.get("page"), dict) else {}
    goal = str(task.get("goal") or "")
    elements = page.get("elements") if isinstance(page.get("elements"), list) else []
    scrolls = _history_scrolls(task)
    swipe_done = swipe_only(goal) and scrolls >= 1
    taskish = bool(re.search(
        r"\b(search|click|open|go to|browse|find|google|mở|tìm|bấm|vào trang|navigate|fill|type|submit)\b",
        blob,
    )) or bool(goal.strip())
    pagish = bool(re.search(
        r"\b(this page|on (the|this) (page|screen|tab)|what's on|look at|màn hình|trang này|trang web)\b",
        blob,
    ))
    preferred_action = None
    action_q = questions.get("action") or {}
    if (action_q or {}).get("type") == "choice":
        if swipe_done and "none" in _criteria_keys(action_q):
            preferred_action = "none"
        else:
            preferred_action = _jev_pick_action(_criteria_keys(action_q), goal, taskish)
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
                p = 0.88 if swipe_done else 0.2
            elif name in ("blocked", "irreversible"):
                p = 0.05
            elif name == "ok":
                p = 0.95
            answers[name] = {"noul": p}
        elif qtype == "choice":
            criteria = _criteria_keys(q)
            pick = criteria[0] if criteria else "none"
            if name == "action":
                pick = preferred_action or _jev_pick_action(criteria, goal, taskish)
            elif name == "target":
                pick = _jev_pick_target(criteria, elements, preferred_action or "click")
            elif name in ("value", "group") and criteria:
                pick = criteria[0]
            probs = {k: (0.9 if k == pick else 0.1 / max(len(criteria) - 1, 1)) for k in criteria} or {pick: 1.0}
            answers[name] = {"choice": pick, "probabilities": probs}
        else:
            answers[name] = {"noul": 0.0}
    return answers


def trim_state(state: dict) -> dict:
    if not isinstance(state, dict):
        return {}
    out = dict(state)
    page = out.get("page")
    if isinstance(page, dict):
        page = dict(page)
        text = str(page.get("text") or "")
        if len(text) > 2500:
            page["text"] = text[:2500] + "…"
        els = page.get("elements")
        if isinstance(els, list):
            slim = []
            for el in els[:80]:
                if not isinstance(el, dict):
                    continue
                slim.append({
                    "index": el.get("index"),
                    "html": str(el.get("html") or "")[:200],
                })
            page["elements"] = slim
        out["page"] = page
    return out


def build_jev_prompt(body: dict) -> str:
    questions = body.get("questions") or {}
    spec = []
    for name, q in questions.items():
        rec = {
            "name": name,
            "type": (q or {}).get("type"),
            "instructions": (q or {}).get("instructions") or "",
        }
        keys = _criteria_keys(q or {})
        if keys:
            rec["criteria"] = keys[:80]
        spec.append(rec)
    return (
        "You are Jev, a typed decision model for a browser agent.\n"
        "Reply with ONE JSON object only, no markdown:\n"
        '{"answers":{"<name>":{"noul":0.0} or {"choice":"<key>","probabilities":{"<key>":0.0}}}}\n'
        "Rules:\n"
        "- noul is P(yes) between 0 and 1.\n"
        "- choice MUST be one of that question's criteria keys.\n"
        "- probabilities must include every criterion, each >= 0, roughly sum to 1.\n"
        "- For action: pick the next single UI verb toward task.goal.\n"
        "- For target: pick the element index whose HTML fits that action "
        "(input/textarea for type, select for select).\n"
        "- If task.goal is only swipe/scroll/lướt a feed and history already has "
        "scroll_down once, set action to none and done noul high. Do not loop.\n"
        f"QUESTIONS:\n{json.dumps(spec, ensure_ascii=False)}\n"
        f"STATE:\n{json.dumps(trim_state(body.get('state') or {}), ensure_ascii=False)}\n"
    )


def _clamp01(value) -> float | None:
    try:
        n = float(value)
    except (TypeError, ValueError):
        return None
    if n > 1 and n <= 100:
        n = n / 100.0
    return max(0.0, min(1.0, n))


def normalize_answers(questions: dict, raw: dict, fallback: dict) -> dict:
    out = {}
    for name, q in questions.items():
        fb = fallback.get(name) or {}
        got = raw.get(name) if isinstance(raw.get(name), dict) else {}
        qtype = (q or {}).get("type")
        if qtype == "noul":
            p = _clamp01(got.get("noul"))
            out[name] = {"noul": p if p is not None else float(fb.get("noul") or 0.15)}
            continue
        if qtype == "choice":
            criteria = _criteria_keys(q)
            pick = str(got.get("choice") or "")
            if pick not in criteria:
                pick = str((fb or {}).get("choice") or (criteria[0] if criteria else "none"))
            probs_in = got.get("probabilities") if isinstance(got.get("probabilities"), dict) else {}
            probs = {}
            for k in criteria:
                p = _clamp01(probs_in.get(k))
                probs[k] = p if p is not None else (0.9 if k == pick else 0.1 / max(len(criteria) - 1, 1))
            total = sum(probs.values()) or 1.0
            probs = {k: v / total for k, v in probs.items()}
            out[name] = {"choice": pick, "probabilities": probs}
            continue
        out[name] = fb or {"noul": 0.0}
    return out


async def answer_jev(body: dict, chat_fn, extract_json, logged_in: bool, llm_backend: str) -> tuple[dict, str]:
    questions = body.get("questions") or {}
    fallback = heuristic_jev(body)
    if not questions or _is_ping(questions):
        return fallback, "regex"
    tries = []
    if llm_backend != "ollama" and logged_in:
        tries.append("codex")
    tries.append("ollama")
    prompt = build_jev_prompt(body)
    for brain in tries:
        payload = {
            "messages": [
                {"role": "system", "content": "Return one JSON object only. No markdown, no prose."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0,
        }
        if brain == "ollama":
            payload["response_format"] = {"type": "json_object"}
        try:
            data = await chat_fn(payload, brain)
        except Exception as e:
            log.warning("jev %s error: %s", brain, e)
            continue
        if not data:
            continue
        choice = (data.get("choices") or [{}])[0]
        msg = choice.get("message") or {}
        content = msg.get("content") or ""
        if isinstance(content, list):
            content = "".join(
                part.get("text", "") if isinstance(part, dict) else str(part) for part in content
            )
        obj = extract_json(str(content))
        if not obj:
            log.warning("jev %s no json", brain)
            continue
        answers = obj.get("answers") if isinstance(obj.get("answers"), dict) else obj
        if not isinstance(answers, dict) or not answers:
            continue
        merged = normalize_answers(questions, answers, fallback)
        log.info("jev via %s keys=%s", brain, list(merged.keys()))
        return merged, brain
    log.info("jev via regex")
    return fallback, "regex"
