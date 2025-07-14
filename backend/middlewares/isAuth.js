const UserModel = require("../models/userModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const jwt = require("jsonwebtoken");

exports.isAuth = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

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
