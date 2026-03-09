const Timetable = require("../models/Timetable");
const TTS = require("../models/TTS");

exports.pollDevice = async (req,res,next)=>{

 try{

 const {deviceId} = req.params;

 const timetable = await Timetable.findOne({deviceId}).lean();

 const tts = await TTS.find({
  deviceId,
  status:"pending"
 }).lean();

 await TTS.updateMany(
  {deviceId,status:"pending"},
  {$set:{status:"read"}}
 );

 res.json({
  success:true,
  timetable,
  tts
 });

 }catch(err){
 next(err);
 }

};