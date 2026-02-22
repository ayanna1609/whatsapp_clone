require("dotenv").config();
const connectDB = require("./config/connection");
const { server } = require("./socket/index"); // only server

console.log("Booting server...");

// GLOBAL ERROR HANDLERS (for Render logs)
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! Shutting down...");
    console.error(err.name, err.message);
    console.error(err.stack);
});

process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! Shutting down...");
    console.error(err.name, err.message);
    console.error(err.stack);
});

const PORT = process.env.PORT || 5000;
console.log("Environment variables loaded:");
console.log("- PORT:", PORT);
console.log("- FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "MAPPED" : "MISSING");

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} (0.0.0.0)`);
});

connectDB();
console.log("connectDB() called.");
