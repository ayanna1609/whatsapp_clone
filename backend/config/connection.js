const { connect } = require("mongoose");

async function connectDB() {
  try {
    const data = await connect(process.env.DATABASE_URL);
    console.log(`Mongodb connected with server ${data.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection failed ERROR:", err.message);
    console.log("Process NOT exiting so you can see this error in Render logs.");
  }
}

module.exports = connectDB;