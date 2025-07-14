const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const connectDB = require("./config/connection");
const router = require("./routes/userRoutes");
const { app, server } = require("./socket/index");


connectDB();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", router);


app.get("/", (req, res) => {
    res.send("API is running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
