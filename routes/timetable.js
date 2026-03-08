const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');

// get timetable
router.get('/:deviceId', async (req,res)=>{
  const tt = await Timetable.findOne({ deviceId:req.params.deviceId });
  res.json(tt);
});

// update timetable
router.put('/:deviceId', async (req,res)=>{
  const { columns, rows } = req.body;
  let tt = await Timetable.findOne({ deviceId:req.params.deviceId });
  if(tt){
    tt.columns = columns;
    tt.rows = rows;
  }else{
    tt = new Timetable({ deviceId:req.params.deviceId, columns, rows });
  }
  await tt.save();
  res.json(tt);
});

module.exports = router;