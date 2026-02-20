require("dotenv").config();
const connectDB = require("./config/connection");
const { server } = require("./socket/index"); // only server

connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
