const express = require("express");
const { check, body } = require("express-validator");
const authController = require("./../controller/auth");
const User = require("./../model/userModel");
const userController = require("./../controller/UserController");
const router = express.Router();

router.get(
  "/Mercado/User/login",
  authController.isLoggedIn,
  authController.getLogin
);

router.get("/signup", authController.isLoggedIn, authController.getSignup);

// router.post(
//   "/signup",
//   check(["name", "email", "password", "passwordConfirm"]).custom(
//     (value, { req }) => {
//       if (value.length <= 0) {
//         throw new Error("ALL FIELDS ARE REQUIRED");
//       }
//       return true;
//     }
//   ),
//   body("email")
//     .isEmail()
//     .trim()
//     .withMessage("Enter A valid Email")
//     .custom(async (value, { req }) => {
//       const user = await User.findOne({ email: value });
//       if (user) {
//         throw new Error("THIS EMAIL HAS BEEN USED BEFORE");
//       }
//       return true;
//     }),
//   body("password")
//     .isAlphanumeric()
//     .trim()
//     .isLength({ min: 8 })
//     .withMessage("Password should have only Letters and Numbers"),
//   body("passwordConfirm").custom((value, { req }) => {
//     if (value !== req.body.password) {
//       throw new Error("Passwords do not Match!!");
//     }

//     return true;
//   }),
//   authController.postSignup
// );
router.get(
  "/Mercado/Users/forgotPassword",
  authController.isLoggedIn,
  userController.forgotPassword
);
router.get(
  "/Mercado/Users/reset/:resetToken",
  authController.isLoggedIn,
  userController.resetPassword
);
module.exports = router;
