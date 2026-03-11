// routes/tts.js  — REPLACE your existing file with this
const express  = require('express');
const router   = express.Router();
const TTSCommand = require('../models/TTSCommand');
const { generateTTS } = require('../services/coquiService');
const { uploadFile }  = require('../services/cloudinaryService');
const fs = require('fs');

router.post('/generate', async (req, res) => {
  const { deviceId, text } = req.body;
  console.log('[TTS Route] deviceId:', deviceId, 'text:', text);

  if (!deviceId || !text) {
    return res.status(400).json({ error: 'Missing deviceId or text' });
  }

  // Set a long timeout on the response so Render doesn't cut it off
  req.setTimeout(110000); // 110s
  res.setTimeout(110000);

  try {
    console.log('[TTS Route] Starting generation...');
    const localFile = await generateTTS(text);

    console.log('[TTS Route] Uploading to Cloudinary...');
    const audio_url = await uploadFile(localFile);

    // Clean up temp file
    try { fs.unlinkSync(localFile); } catch (_) {}

    const tts = new TTSCommand({
      deviceId,
      announcement: text,
      audio_url,
      status: 'pending',
    });
    await tts.save();

    console.log('[TTS Route] Success. audio_url:', audio_url);
    res.json({ message: 'TTS generated', audio_url });

  } catch (err) {
    console.error('[TTS Route] Failed:', err.message);
    res.status(500).json({
      error: 'Failed to generate TTS',
      detail: err.message, // visible in Flutter debug logs
    });
  }
});

module.exports = router;