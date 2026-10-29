"""coerce_reply must turn llama3.2 tool-prose into a spoken bubble."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "server"))
import app as local  # noqa: E402


def spoken(content: str, user: str = "") -> str:
    return local.coerce_reply(content, last_user=user)["messages"][0]["text"]


def main() -> None:
    dump = 'hiii\nrun tool reply {\n  "message": "hiii~! What\'s up?"\n}'
    got = spoken(dump, "hiii")
    assert "run tool" not in got.lower(), got
    assert "hiii~" in got, got

    yaml = 'emotion: happy\nmessages:\n  - text: Hey! Nice to meet you!\n  - tts_text: "Heeey!"'
    got = spoken(yaml, "hiii")
    assert got == "Hey! Nice to meet you!", got

    got = spoken("hehe xin chào", "hiii")
    assert got == "hehe xin chào", got

    truncated = 'run tool reply { "message": "ủa mình nghe nè", "emotion": "happy"'
    got = spoken(truncated, "ủa sao lại hiện như này")
    assert got == "ủa mình nghe nè", got

    heading = (
        "Reply\n\nmessages:\n\ntext: Hello! How are you?\n"
        "tts_text: Hello! Hello!\n"
        "tts_text: Hey, haha, I'm so happy to see you!"
    )
    got = spoken(heading, "hiii")
    want = "Hello! How are you?"
    if got != want:
        raise AssertionError(f"got={got!r} want={want!r}")
    tts = local.coerce_reply(heading, last_user="hiii")["messages"][0]["tts_text"]
    assert "haha" in tts, tts
    assert "messages:" not in got
    assert not got.lower().startswith("reply")

    got = spoken("assistant\n\nHalo, apa kabar?", "hiii")
    assert got == "Halo, apa kabar?", got

    print("COERCE_OK")


if __name__ == "__main__":
    main()
