# GPU image: VieNeu PyTorch CUDA + ZeroTTS onnxruntime-gpu.
# Docker Desktop WSL2 needs the NVIDIA driver + `gpus: all` in compose.
FROM nvidia/cuda:12.4.1-cudnn-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    HF_HOME=/root/.cache/huggingface \
    ZW_LOCAL_HOST=0.0.0.0 \
    ZW_LOCAL_PORT=8787 \
    ZW_PUBLIC_BASE=http://127.0.0.1:8787 \
    TTS_DEVICE=cuda \
    ZEROTTS_DEVICE=cuda \
    NVIDIA_VISIBLE_DEVICES=all \
    NVIDIA_DRIVER_CAPABILITIES=compute,utility

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        python3 \
        python3-pip \
        python3-venv \
        ffmpeg \
        git \
        ca-certificates \
        libgomp1 \
        libglib2.0-0 \
        libsndfile1 \
        espeak-ng \
    && ln -sf /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY server/requirements.txt /app/server/requirements.txt
RUN pip3 install --no-cache-dir --upgrade pip \
    && pip3 install --no-cache-dir torch torchaudio --index-url https://download.pytorch.org/whl/cu124
RUN grep -v 'onnxruntime-gpu' /app/server/requirements.txt > /tmp/req.txt \
    && pip3 install --no-cache-dir -r /tmp/req.txt \
    && pip3 install --no-cache-dir transformers safetensors accelerate \
    && pip3 uninstall -y onnxruntime \
    && pip3 install --no-cache-dir 'onnxruntime-gpu>=1.20' \
    && python3 -c "import torch,onnxruntime as o; print('torch', torch.__version__, 'cuda_compiled', torch.version.cuda); print('ort', o.__version__, o.get_available_providers())"

COPY server /app/server
RUN mkdir -p /app/server/static/zai \
    && rm -f /app/server/data/zw_key.txt

WORKDIR /app/server
EXPOSE 8787

CMD ["python3", "app.py"]
