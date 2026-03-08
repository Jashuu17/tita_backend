// services/cloudinaryService.js
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

const CLOUD_NAME = process.env.CLOUD_NAME;
const UPLOAD_PRESET = "tita_unsigned"; // must match your unsigned preset

async function uploadFile(localFilePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(localFilePath));
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", "tita_audio");

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

  try {
    const response = await axios.post(url, form, {
      headers: form.getHeaders(),
    });
    return response.data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { uploadFile };