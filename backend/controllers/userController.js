const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/sendToken"); 

// =================== REGISTER USER ===================
exports.registerUser = catchAsyncErrors(async (req, res) => {
  const { name, email, password, profilePic } = req.body;

  // Check if user already exists
  const checkEmail = await userModel.findOne({ email });
  if (checkEmail) {
    return res.status(400).json({ message: "User already exists", error: true });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);

  // Create user
  const user = await userModel.create({
    name,
    email,
    password: hashPass,
    profilePic,
  });

  console.log("Created User:", user);           // debug
  console.log("User._id:", user?._id);          // debug
  console.log("JWT Token:", user.getJWTToken()); // debug token

  if (user) {
    sendToken(user, 201, res); // send cookie + token
  } else {
    res.status(500).json({ message: "User creation failed", error: true });
  }
});

// =================== LOGIN USER ===================
exports.login = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User does not exist", error: true });
  }

  // Compare password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Incorrect password", error: true });
  }

  console.log("Logged-in User:", user);               // debug
  console.log("JWT Token:", user.getJWTToken());      // debug token

  sendToken(user, 200, res);
});

// =================== LOGOUT USER ===================
exports.logout = catchAsyncErrors(async (req, res) => {
  // For localhost, disable secure & adjust sameSite
  const cookieOptions = {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: false,    // must be false for http://localhost
    sameSite: "lax",
  };

  return res.cookie("token", "", cookieOptions).status(200).json({
    message: "Logout successful",
    success: true,
  });
});

// =================== GET USER DETAILS ===================
exports.userDetails = catchAsyncErrors(async (req, res) => {
  return res.status(200).json({
    message: "User details",
    user: req.user,
  });
});

// =================== UPDATE USER ===================
exports.updateUser = catchAsyncErrors(async (req, res) => {
  const { userId, name, profilePic } = req.body;
  console.log("Updating user:", userId, name, profilePic);

  const updateuser = await userModel.updateOne(
    { _id: userId },
    { $set: { name, profilePic } }
  );

  console.log(updateuser);

  if (updateuser?.modifiedCount === 1) {
    const user = await userModel.findById(userId);
    return res.status(200).json({ message: "User updated successfully", user, success: true });
  } else if (updateuser?.matchedCount === 1 && updateuser?.modifiedCount === 0) {
    return res.status(200).json({ message: "No changes detected", success: true });
  } else {
    return res.status(400).json({ message: "User not updated", error: true });
  }
});

// =================== SEARCH USERS ===================
exports.searchUser = catchAsyncErrors(async (req, res) => {
  const { search } = req.body;
  const query = new RegExp(search, "i");
  const users = await userModel.find({
    $or: [{ name: query }, { email: query }],
  }).select("-password");

  console.log("Search Results:", users);

  return res.status(200).json({ message: "All users", users, success: true });
});
