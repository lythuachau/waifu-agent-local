import json
import ssl
import urllib.error
import urllib.request
from pathlib import Path

KEY = "Zw_eyJ1IjoibGY3bXB6U1JiQmdVREZpcXJWeFVPRENxQkNTMiIsInIiOiJlMGYzY2FjYS1mNDdhLTQ3ZTctOTAzYi0wNDZkNTFjNTZhZTAifQ"
CTX = ssl.create_default_context()
HAVE = {p.stem for p in Path(r"E:\ll\waifu-agent-extract\self-host\server\data\offline_tokens").glob("*.json")}
CAT = json.loads(Path(r"E:\ll\waifu-agent-extract\self-host\server\data\dashboard_catalog.json").read_text(encoding="utf-8"))


def hit(url: str):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json", "X-ZW-Api-Key": KEY},
    )
    try:
        with urllib.request.urlopen(req, timeout=25, context=CTX) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def main() -> None:
    print("catalog", len(CAT), "already", len(HAVE))
    for a in CAT:
        aid = a["id"]
        mark = "HAVE" if aid in HAVE else "NEW"
        st, _ = hit(f"https://api.zeroweight.ai/api/v1/avatars/bundle/{aid}")
        pst, pbody = hit(f"https://api.zeroweight.ai/api/v1/avatars/{aid}/persona")
        pname = "?"
        if pst == 200:
            try:
                pname = json.loads(pbody).get("display_name")
            except Exception:
                pass
        print(f"{mark} bundle={st} persona={pst} {aid} {a.get('name')} as={pname} price={a.get('price')}")


if __name__ == "__main__":
    main()
