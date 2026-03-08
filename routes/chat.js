const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// fetch messages
router.get('/:deviceId', async (req,res)=>{
  const msgs = await Message.find({ deviceId:req.params.deviceId });
  res.json(msgs);
});

// post message
router.post('/:deviceId', async (req,res)=>{
  const { sender, text } = req.body;
  const msg = new Message({ deviceId:req.params.deviceId, sender, text });
  await msg.save();
  res.json(msg);
});

module.exports = router;