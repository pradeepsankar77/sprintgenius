const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    // Exit so the failure is obvious immediately rather than silently
    // failing on the first request that touches the database.
    process.exit(1);
  }
}

module.exports = connectDB;
