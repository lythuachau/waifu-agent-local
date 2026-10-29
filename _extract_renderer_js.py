from pathlib import Path
import re

p = Path(r"E:\ll\waifu-agent-extract\unpacked\chunks\avatar-frame-BJIbEIav.js")
t = p.read_text(encoding="utf-8", errors="replace")
print("len", len(t))
t2 = re.sub(r"data:application/wasm;base64,[A-Za-z0-9+/=]+", "WASM_STRIPPED", t)
print("stripped", len(t2))
out = Path(r"E:\ll\waifu-agent-extract\self-host\avatar-frame-js.txt")
out.write_text(t2, encoding="utf-8")

idx = 0
n = 0
while n < 20:
    i = t2.find("payload", idx)
    if i < 0:
        break
    print("\n--- payload", i, "---")
    print(t2[max(0, i - 180) : i + 280])
    idx = i + 7
    n += 1

print("\n\n=== expir ===")
for m in re.finditer("expir", t2, re.I):
    print(t2[max(0, m.start() - 100) : m.start() + 160])
    print("---")

print("\n\n=== class ZeroWeight ===")
for pat in ["class ", "init(", "loadAction", "fetch(", ".zai", "cdn-public", "decrypt", "AES"]:
    print(pat, t2.lower().count(pat.lower()))
