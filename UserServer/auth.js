const express = require("express");
const {loginUser,registerUser,verifyUser} = require("./authController");

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/verify").post(verifyUser);

module.exports = router;