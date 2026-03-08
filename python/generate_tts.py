# python/generate_tts.py
import sys
from TTS.api import TTS

if len(sys.argv) != 3:
    print("Usage: python generate_tts.py '<text>' <output_file>")
    sys.exit(1)

text = sys.argv[1]
output_path = sys.argv[2]

# Initialize TTS model (LJSpeech Tacotron2-DDC English)
tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False, gpu=False)

# Generate audio file
tts.tts_to_file(text=text, file_path=output_path)

print(f"Generated audio file: {output_path}")