const express = require('express');
const router = express.Router();
const TTSCommand = require('../models/TTSCommand');
const { generateTTS } = require('../services/coquiService');
const { uploadFile } = require('../services/cloudinaryService');
const fs = require('fs');

router.post('/generate', async (req, res) => {
  const { deviceId, text } = req.body;
  if (!deviceId || !text) return res.status(400).json({ error: 'Missing deviceId or text' });

  try {
    const localFile = await generateTTS(text);
    const audio_url = await uploadFile(localFile);
    fs.unlinkSync(localFile);

    const tts = new TTSCommand({ deviceId, announcement: text, audio_url, status: 'pending' });
    await tts.save();

    res.json({ message: 'TTS generated', audio_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate TTS' });
  }
});

module.exports = router;