const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", () => {
  console.log("MQTT connected");
});

module.exports = client;