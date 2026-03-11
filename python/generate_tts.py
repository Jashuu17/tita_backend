# python/generate_tts.py
import sys
import os

if len(sys.argv) != 3:
    print("Usage: python generate_tts.py '<text>' <output_file>")
    sys.exit(1)

text = sys.argv[1]
output_path = sys.argv[2]

# Ensure output directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

from TTS.api import TTS

# Use cached model (downloaded during build step)
tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False, gpu=False)
tts.tts_to_file(text=text, file_path=output_path)

print(f"Generated audio file: {output_path}")