#!/bin/bash
set -e

echo "=== Installing Node dependencies ==="
npm install

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Pre-downloading Coqui TTS model ==="
python3 -c "from TTS.api import TTS; TTS(model_name='tts_models/en/ljspeech/tacotron2-DDC', progress_bar=False, gpu=False); print('Model ready.')"

echo "=== Creating temp_audio directory ==="
mkdir -p temp_audio

echo "=== Build complete ==="