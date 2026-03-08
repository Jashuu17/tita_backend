require('dotenv').config(); // Must be at top
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const mqtt = require('mqtt');

const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/device');
const timetableRoutes = require('./routes/timetable');
const chatRoutes = require('./routes/chat');
const ttsRoutes = require('./routes/tts');

const app = express();
app.use(cors());
app.use(express.json());

// MQTT setup
const mqttClient = mqtt.connect(process.env.MQTT_URL);
mqttClient.on('connect', () => console.log('MQTT connected'));
app.locals.mqttClient = mqttClient;

// routes
app.use('/api/auth', authRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/tts', ttsRoutes);

// start server
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});