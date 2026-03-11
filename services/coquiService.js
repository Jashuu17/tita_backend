// services/coquiService.js
const { exec } = require('child_process');
const path = require('path');
const fs   = require('fs');

async function generateTTS(text) {
  return new Promise((resolve, reject) => {
    // Ensure temp_audio exists
    const tempDir = path.join(__dirname, '../temp_audio');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const fileName = `audio_${Date.now()}.mp3`;
    const filePath = path.join(tempDir, fileName);

    // Sanitize text
    const safeText = text.replace(/["\\]/g, '').substring(0, 500);

    const cmd = `python3 python/generate_tts.py "${safeText}" "${filePath}"`;
    console.log('[TTS] Running:', cmd);

    exec(cmd, { timeout: 30000 }, (err, stdout, stderr) => {
      if (err) {
        console.error('[TTS] Error:', err.message);
        console.error('[TTS] stderr:', stderr);
        return reject(new Error(`TTS generation failed: ${err.message}\n${stderr}`));
      }
      // gTTS always outputs mp3
      const actualPath = filePath.replace('.wav', '.mp3');
      if (!fs.existsSync(actualPath)) {
        return reject(new Error(`TTS output file not created at ${actualPath}`));
      }
      console.log('[TTS] Done:', actualPath);
      resolve(actualPath);
    });
  });
}

module.exports = { generateTTS };