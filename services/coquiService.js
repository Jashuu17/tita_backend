const { exec } = require('child_process');
const path = require('path');

async function generateTTS(text){
  return new Promise((resolve,reject)=>{
    const fileName = `audio_${Date.now()}.wav`;
    const filePath = path.join(__dirname,'../temp_audio',fileName);
    exec(`python python/generate_tts.py "${text}" "${filePath}"`, (err)=>{
      if(err) return reject(err);
      resolve(filePath);
    });
  });
}

module.exports = { generateTTS };