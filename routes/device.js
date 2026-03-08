const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const Timetable = require('../models/Timetable');
const TTSCommand = require('../models/TTSCommand');

// Device auth
router.post('/auth', async (req,res)=>{
  const { deviceId, authSecret } = req.body;
  const device = await Device.findOne({ deviceId, authSecret });
  if(!device) return res.status(401).json({ error:'Unauthorized' });
  res.json({ message:'Authenticated' });
});

// Poll for timetable + tts
router.get('/:deviceId/poll', async (req,res)=>{
  const { deviceId } = req.params;
  try{
    const timetable = await Timetable.findOne({ deviceId });
    const tts = await TTSCommand.find({ deviceId, status:'pending' });
    await TTSCommand.updateMany({ deviceId, status:'pending' }, { status:'read' });
    res.json({ timetable, tts });
  }catch(err){
    console.error(err);
    res.status(500).json({ error:'Server error' });
  }
});

module.exports = router;