const UserModel = require("../models/userModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const jwt = require("jsonwebtoken");

exports.isAuth = catchAsyncErrors(async (req, res, next) => {
  // Try header first
  let token = req.headers.authorization?.split(" ")[1]; // 'Bearer <token>'
  console.log("Token from header:", token);

  // Fallback to cookie
  if (!token) token = req.cookies?.token;
  console.log("Token from cookies:", token);

  if (!token) {
    return res.status(401).json({
      message: "Please login to access this resource",
      error: true,
    });
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await UserModel.findById(decodedData.id);
  next();
});
