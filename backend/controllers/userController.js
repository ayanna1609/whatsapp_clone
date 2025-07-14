const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/sendToken"); 

exports.registerUser = catchAsyncErrors(async (req, res) => {
  const { name, email, password, profilePic } = req.body;

  const checkEmail = await userModel.findOne({ email });
  if (checkEmail) {
    return res.status(400).json({
      message: "User already exists",
      error: true,
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);

  const user = await userModel.create({
    name,
    email,
    password: hashPass,
    profilePic,
  });

  if (user) {
    sendToken(user, 201, res); 
  } else {
    res.status(500).json({
      message: "User creation failed",
      error: true,
    });
  }
});

exports.login = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "User does not exist",
      error: true,
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Incorrect password",
      error: true,
    });
  }

  sendToken(user, 200, res); 
});
exports.logout = catchAsyncErrors(async (req, res) => {
  const cookieOptions = {
    http: true,
    secure: true,
    samesite: "None",
  };

  return res.cookie("token", "", cookieOptions).status(200).json({
    message: "logout successfully",
    succes: true,
  });
});

// user details
exports.userDetails = catchAsyncErrors(async (req, res) => {
  return res.status(200).json({
    message: "user details",
    user: req.user,
  });
});

//update user
exports.updateUser = catchAsyncErrors(async (req, res) => {
  const { userId, name, profilePic } = req.body;

  console.log("Updating user:", userId, name, profilePic); // Debug log

  const updateuser = await userModel.updateOne(
    { _id: userId },
    { $set: { name, profilePic } }
  );

  console.log(updateuser); // Debug result

  if (updateuser?.modifiedCount === 1) {
    const user = await userModel.findById(userId);

    return res.status(200).json({
      message: "User updated successfully",
      user,
      success: true,
    });
  } else if (updateuser?.matchedCount === 1 && updateuser?.modifiedCount === 0) {
    return res.status(200).json({
      message: "No changes detected (same values)",
      success: true,
    });
  } else {
    return res.status(400).json({
      message: "User not updated (invalid ID or database issue)",
      error: true,
    });
  }
});

exports.searchUser = catchAsyncErrors(async (req, res) => {
  const { search } = req.body;

  const query = new RegExp(search, "i", "g");
  const users = await userModel.find({
    $or: [{ name: query }, { email: query }],
  }).select("-password");
  console.log(users, "users");

  return res.status(200).json({
    message: "all users",
    users,
    success: true,
  });
});
