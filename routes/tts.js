// routes/tts.js
const express    = require('express');
const router     = express.Router();
const TTSCommand = require('../models/TTSCommand');
const { generateTTS } = require('../services/coquiService');
const { uploadFile }  = require('../services/cloudinaryService');
const fs         = require('fs');

// ── CHANGE 1: Import MQTT client ─────────────────────────────────────────
const mqttClient = require('../services/mqttService');
// ────────────────────────────────────────────────────────────────────────

// POST /api/tts/generate
router.post('/generate', async (req, res) => {
  const { deviceId, text } = req.body;
  console.log('[TTS Route] deviceId:', deviceId, 'text:', text);

  if (!deviceId || !text) {
    return res.status(400).json({ error: 'Missing deviceId or text' });
  }

  req.setTimeout(110000);
  res.setTimeout(110000);

  try {
    console.log('[TTS Route] Starting generation...');
    const localFile = await generateTTS(text);

    console.log('[TTS Route] Uploading to Cloudinary...');
    const audio_url = await uploadFile(localFile);

    try { fs.unlinkSync(localFile); } catch (_) {}

    const tts = new TTSCommand({
      deviceId,
      announcement: text,
      audio_url,
      status: 'pending',
    });
    await tts.save();

    // ── CHANGE 2: Publish to MQTT so ESP32 gets it instantly ─────────────
    const topic   = 'tita/' + deviceId + '/tts';
    const payload = JSON.stringify({
      id:        tts._id.toString(),
      audio_url: audio_url,
      text:      text,
    });
    mqttClient.publish(topic, payload);
    console.log('[TTS Route] Published to MQTT topic:', topic);
    // ─────────────────────────────────────────────────────────────────────

    console.log('[TTS Route] Success. audio_url:', audio_url);
    res.json({ message: 'TTS generated', audio_url });

  } catch (err) {
    console.error('[TTS Route] Failed:', err.message);
    res.status(500).json({
      error:  'Failed to generate TTS',
      detail: err.message,
    });
  }
});

// ── CHANGE 3: Mark TTS as played (ESP32 calls this after playing audio) ──
router.put('/:id/played', async (req, res) => {
  try {
    await TTSCommand.findByIdAndUpdate(req.params.id, { status: 'played' });
    console.log('[TTS Route] Marked as played:', req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('[TTS Route] markPlayed error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
// ─────────────────────────────────────────────────────────────────────────

module.exports = router;