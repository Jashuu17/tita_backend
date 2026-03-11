# python/generate_tts.py
import sys
import os
from gtts import gTTS

if len(sys.argv) != 3:
    print("Usage: python generate_tts.py '<text>' <output_file>")
    sys.exit(1)

text = sys.argv[1]
output_path = sys.argv[2]

# Ensure output directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Generate TTS using Google TTS (no model download needed)
tts = gTTS(text=text, lang='en', slow=False)

# gTTS outputs mp3 — save as mp3 but keep the path given
# Change extension to mp3 so ESP32 can play it
mp3_path = output_path.replace('.wav', '.mp3')
tts.save(mp3_path)

print(f"Generated audio file: {mp3_path}")
# Print the actual path so coquiService.js gets it
sys.stdout.flush()