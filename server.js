require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const timetableRoutes = require("./routes/timetable");
const deviceRoutes = require("./routes/device");
const ttsRoutes = require("./routes/tts");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rate limit
const limiter = rateLimit({
 windowMs: 15 * 60 * 1000,
 max: 100
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/tts", ttsRoutes);

// Error handler
app.use(errorHandler);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "TITA Backend API Running 🚀"
  });
});

app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});