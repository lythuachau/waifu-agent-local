"""Light screenshot reader — RapidOCR ONNX, same stack as dsh-pet.

Does not describe photos. It extracts printed / UI text from a JPEG/PNG
in-process (CPU, ~30 MB weights). Contrast: Ollama llava is a 4+ GB VLM.
"""
from __future__ import annotations

import base64
import logging
import threading
from pathlib import Path

log = logging.getLogger("vision_ocr")

ROOT = Path(__file__).resolve().parent
MODELS = ROOT / "data" / "rapidocr_models"
_engine = None
_lock = threading.Lock()


def available() -> bool:
    return (MODELS / "PP-OCRv6_det_small.onnx").exists() and (
        MODELS / "PP-OCRv6_rec_small.onnx"
    ).exists()


def get_engine():
    global _engine
    with _lock:
        if _engine is not None:
            return _engine
        from rapidocr import RapidOCR

        params = {
            "Det.model_path": str(MODELS / "PP-OCRv6_det_small.onnx"),
            "Rec.model_path": str(MODELS / "PP-OCRv6_rec_small.onnx"),
            "Cls.model_path": str(MODELS / "ch_ppocr_mobile_v2.0_cls_mobile.onnx"),
            "EngineConfig.onnxruntime.enable_cpu_mem_arena": False,
            "EngineConfig.onnxruntime.use_cuda": False,
        }
        log.info("loading RapidOCR from %s", MODELS)
        _engine = RapidOCR(params=params)
        return _engine


def _decode_image(raw: bytes):
    import cv2
    import numpy as np

    arr = np.frombuffer(raw, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("could not decode screenshot")
    h, w = img.shape[:2]
    max_side = 1600
    longest = max(h, w)
    if longest > max_side:
        scale = max_side / longest
        img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
    return img


def describe_bytes(raw: bytes) -> str:
    img = _decode_image(raw)
    result = get_engine()(img)
    txts = [str(t).strip() for t in (getattr(result, "txts", None) or []) if str(t).strip()]
    if not txts:
        return (
            "OCR found no readable text in the screenshot. "
            "This reader extracts UI/print text only; it cannot name objects in photos. "
            "Use the numeric [index] list from the page, or set Vision to llava for scene describe."
        )
    lines = "\n".join(txts[:200])
    return (
        "Visible text on the screenshot (local RapidOCR, not a photo captioner):\n"
        f"{lines}"
    )


def describe_data_url(url: str) -> str:
    payload = url
    if payload.startswith("data:") and "," in payload:
        payload = payload.split(",", 1)[1]
    raw = base64.b64decode(payload)
    return describe_bytes(raw)
