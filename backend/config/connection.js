const { connect } = require("mongoose");

async function connectDB() {
  try {
    const data = await connect(process.env.DATABASE_URL);
    console.log(`Mongodb connected with server ${data.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Exit process if DB connection fails
  }
}

module.exports = connectDB;