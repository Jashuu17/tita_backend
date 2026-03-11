#!/bin/bash
set -e

echo "=== Installing Node dependencies ==="
npm install

echo "=== Installing Python dependencies ==="
pip install gTTS

echo "=== Creating temp_audio directory ==="
mkdir -p temp_audio

echo "=== Build complete ==="