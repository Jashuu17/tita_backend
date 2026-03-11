// services/coquiService.js  — REPLACE your existing file with this
const { exec } = require('child_process');
const path = require('path');
const fs   = require('fs');

async function generateTTS(text) {
  return new Promise((resolve, reject) => {

    // Make sure temp_audio folder exists
    const tempDir = path.join(__dirname, '../temp_audio');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const fileName = `audio_${Date.now()}.wav`;
    const filePath = path.join(tempDir, fileName);

    // Sanitize text: remove quotes and backslashes to prevent shell injection
    const safeText = text.replace(/["\\]/g, '').substring(0, 500);

    const cmd = `python python/generate_tts.py "${safeText}" "${filePath}"`;
    console.log('[TTS] Running:', cmd);

    // Give Python/Coqui up to 90 seconds
    exec(cmd, { timeout: 90000 }, (err, stdout, stderr) => {
      if (err) {
        console.error('[TTS] Error:', err.message);
        console.error('[TTS] stderr:', stderr);
        return reject(new Error(`TTS generation failed: ${err.message}\n${stderr}`));
      }
      if (!fs.existsSync(filePath)) {
        return reject(new Error(`TTS output file not created at ${filePath}`));
      }
      console.log('[TTS] Generated:', filePath);
      resolve(filePath);
    });
  });
}

module.exports = { generateTTS };