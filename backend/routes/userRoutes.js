const express = require("express");
const {
  registerUser,
  login,
  logout,
  userDetails,
  updateUser,
  searchUser,
} = require("../controllers/userController");
const { isAuth } = require("../middlewares/isAuth"); // ✅ named import

const router = express.Router();
// DEBUG: Get all users to verify MongoDB content
const userModel = require("../models/userModel");
router.get("/debug-all-users", async (req, res) => {
  const users = await userModel.find({});
  res.json(users);
});


router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/userDetails").get(isAuth, userDetails);
router.route("/updateUser").put(updateUser);
router.route("/searchUser").post(searchUser);
module.exports = router;
