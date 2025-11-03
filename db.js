const mongoose = require("mongoose");

const connectDB = async (dbURL) => {
  try {
    await mongoose.connect(dbURL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

module.exports = connectDB;
