const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

router.get('/', async (req, res) => res.json(await Device.find().populate('assignedFaculty', 'username')));
router.post('/', async (req, res) => {
  const d = new Device(req.body);
  await d.save();
  res.json(d);
});

module.exports = router;