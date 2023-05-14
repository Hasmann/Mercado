const express = require("express");
const authController = require("../controller/auth.js");
const Merchant = require("../model/merchantModel");
const User = require("../model/userModel");
const router = express.Router();
router.post("/merchant/signUp", authController.merchantSignUp);
router.post("/user/signUp", authController.userSignUp);
router.post("/user/userLogin", authController.UserLogin);
router.post("/merchant/merchantLogin", authController.MerchantLogin);
router.post("/users/reset", authController.sendResetToken);
router.patch("/users/reset/:resetToken", authController.sentTokenReset);
router.post(
  "/user/passwordUpdate",
  authController.protect,
  authController.updatePassword
);
router.post("/user/logout", authController.protect, authController.logout);
module.exports = router;
