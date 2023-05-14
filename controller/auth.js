const Merchant = require("./../model/merchantModel.js");
const Product = require("./../model/Products");
const User = require("./../model/userModel.js");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const secret = process.env.HASSAN_SECRET;
const sendMail = require("./../sendMail/MailSystem");
const crypto = require("crypto");
// const { validationResult } = require("express-validator/check");
const { stat } = require("fs");
const catchAsync = require("./../catchAsync.js");
const errorClass = require("./../errorClass.js");

function generateToken(id) {
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_TIME,
  });
}

function setCookie(res, statusCode, id, userType) {
  const token = generateToken(id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("userrtoken", token, cookieOptions);

  res.status(statusCode).json({
    status: "SUCCESS",
    message: `${userType || "User"} Logged In Successfully`,
    token: token,
  });
}

exports.userSignUp = catchAsync(async (req, res, next) => {
  const { fullName, email, password, passwordConfirm } = req.body;
  const emailExists = await User.findOne({ email: email });
  console.log(emailExists);
  if (emailExists) {
    return res.status(401).json({
      message: "THIS EMAIL HAS BEEN USED BEFORE",
    });
  }

  const newUser = await User.create({
    fullName: fullName,
    email: email,
    password: password,
    passwordConfirm: passwordConfirm,
  });

  if (newUser) {
    res.status(201).json({
      status: "success",
      message: "user created successfully",
      user: {
        user: newUser,
      },
    });
  } else {
    return next(errorClass("failed to create user", 400));
  }
});

exports.merchantSignUp = async (req, res, next) => {
  try {
    const {
      fullName,
      VirtualStoreName,
      Category,
      email,
      password,
      passwordConfirm,
    } = req.body;
    const emailExists = await Merchant.findOne({ email: email });
    console.log(emailExists);
    if (emailExists) {
      return res.status(401).json({
        message: "THIS EMAIL HAS BEEN USED BEFORE",
      });
    }
    const newmerchant = await Merchant.create({
      fullName: fullName,
      VirtualStoreName: VirtualStoreName,
      Category: Category,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
    });
    if (!newmerchant) {
      res.status(400).json({
        status: "failed",
        message: "for a reason this user was not created",
      });
    }
    res.status(201).json({
      status: "success",
      message: "marchant created successfully",
      merchant: {
        merchant: newmerchant,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: "failed to create merchant",
      error: {
        error: err,
      },
    });
  }
};

const multipleLogin = async function (req, res, next, server, userType) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      console.log("checked body");
      res.status(400).json({
        message: "EMAIL AND PASSWORD REQUIRED",
      });
    }

    const logUser = await server.findOne({ email: email }).select("+password");
    if (!logUser) {
      console.log("reached checkemail");
      res.status(400).json({
        message: "EMAIL OR PASSWORD DOES NOT MATCHee",
      });
    }

    if (!logUser || !(await logUser.checkPass(password, logUser.password))) {
      console.log("reached passauth");
      res.status(400).json({
        message: "EMAIL OR PASSWORD IS WRONG",
      });
    } else {
      req.user = logUser;
      console.log("tatratra", req.user);
      setCookie(res, 200, logUser._id, userType);
    }
  } catch (err) {
    res.status(400).json({
      status: "failee",
      error: err,
    });
  }
};

exports.UserLogin = async (req, res, next) => {
  await multipleLogin(req, res, next, User, "User");
};

exports.MerchantLogin = async (req, res, next) => {
  await multipleLogin(req, res, next, Merchant, "Merchant");
};

exports.protect = async (req, res, next) => {
  //1) step1 check if there is a token on the page
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.userrtoken) {
    token = req.cookies.userrtoken;
  }
  console.log(token);
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "DID NOT FIND TOKEeeN",
    });
  }

  //step 2 verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.HASSAN_SECRET);
  console.log("THIS IS DECODED", decoded);
  //check if the user still exists
  let currentUser =
    (await User.findById(decoded.id)) || (await Merchant.findById(decoded.id));

  if (!currentUser) {
    return res.status(400).json({
      status: "fail",
      message:
        "this User associated with this token does not exist any longer :)",
    });
  }
  console.log("currr----", currentUser);

  //check if the password of the user has not changed

  if (currentUser.checkPasswordChange(decoded.iat)) {
    return res.status(401).json({
      status: "fail",
      message: "YOU HAVE CHANGED YOUR PASSWORD PLEASE LOGIN AGAIN",
    });
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.isAuthenticated = req.user;
  console.log(" protection successfully passed");

  next();
};
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.userrtoken) {
    const token = req.cookies.userrtoken;

    //step 2 verify the token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.HASSAN_SECRET
    );
    console.log("THIS IS DECODED", decoded);
    //check if the user still exists
    const currentUser =
      (await User.findById(decoded.id)) ||
      (await Merchant.findById(decoded.id));
    if (!currentUser) {
      return next();
    }

    //check if the password of the user has not changed

    if (currentUser.checkPasswordChange(decoded.iat)) {
      next();
    }
    //GRANT ACCESS TO PROTECTED ROUTE
    res.locals.isAuthenticated = currentUser;
    req.user = currentUser;
    console.log("successfully passed");
    return next();
  } else {
    res.locals.isAuthenticated = null;
    return next();
  }
};

exports.authorizedRole = (...authorizedUsers) => {
  return (req, res, next) => {
    if (!authorizedUsers.includes(req.user.role)) {
      return res.status(401).json({
        status: "failed",
        Reason: "Not Authorized",
        message: "YOU ARE NOT AUTHORIZED TO USE THIS PAGE",
      });
    }
    next();
  };
};

exports.sendResetToken = async (req, res, next) => {
  try {
    const myUser =
      (await User.findOne({ email: req.body.email })) ||
      (await Merchant.findOne({ email: req.body.email }));
    console.log("HERE 1");
    if (!myUser) {
      return res.status(404).json({
        status: "fail",
        message: "THIS USER DOES NOT EXIST",
      });
    }
    console.log("HERE 2");
    const token = myUser.setResetToken();
    console.log("HERE 3");
    console.log(token);
    console.log(myUser.email);

    await myUser.save({ validateBeforeSave: false });

    console.log("HERE 4");
    const messageSend = `Thank you for updating yor work your reset token is 
  http://127.0.0.1:2007/Mercado/Users/reset/${token}`;
    sendMail(myUser.email, "RESET EMAIL", messageSend);
    console.log("HERE 5");
    res.status(200).json({
      status: "success",
      message: "Email sent Successfully",
    });
  } catch (err) {
    // myUser.sendResetToken = undefined;
    // myUser.passwordResetTimer = undefined;
    // await myUser.save({ validateBeforeSave: false });
    res.status(400).json({
      status: "fail",
      error: err,
    });
  }
};

exports.sentTokenReset = async (req, res, next) => {
  try {
    const token = req.params.resetToken;
    console.log(token);
    const compToken = crypto.createHash("sha256").update(token).digest("hex");
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    const tokUser =
      (await User.findOne({
        sendResetToken: compToken,
        passwordResetTimer: { $gte: Date.now() },
      })) ||
      (await Merchant.findOne({
        sendResetToken: compToken,
        passwordResetTimer: { $gte: Date.now() },
      }));
    console.log(tokUser);

    if (!tokUser) {
      res.status(400).json({
        status: "failed",
        message: "This token is no longer valid",
      });
    }
    tokUser.password = password;
    tokUser.passwordConfirm = passwordConfirm;
    tokUser.sendResetToken = undefined;
    tokUser.passwordResetTimer = undefined;
    await tokUser.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "Success",
      message: "Password Successfully changed",
      user: {
        tokUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      error: err,
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const postPass = req.body.passwordCurrent;
    if (!(await user.checkPass(postPass, user.password))) {
      return res.status(401).json({
        status: "FAILED",
        message: "THE PASSWORD ENTRED IS NOT CORRECT",
      });
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    setCookie(res, 200, user._id);

    console.log("logged in successfully");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: err,
    });
  }
};

exports.logout = (req, res, next) => {
  try {
    res.cookie("userrtoken", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      Error: err,
    });
  }
};

exports.checkProductPage = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    console.log("CHECK PRODUCTPAGEEE MIDDLEWARE");
    console.log("COOKIE", req.cookies.previouslyViewed);
    if (req.user) {
      req.user.addPage(productId);
      console.log("PAGEEEEEEEEEE", req.user);
      next();
    } else {
      if (!req.cookies.previouslyViewed) {
        console.log("THIS COOKIE DOES NOT EXISTS");
        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
          ),
          httpOnly: true,
        };
        res.cookie("previouslyViewed", [], cookieOptions);
      }
      console.log("BEFORE IT WAS ALTERED", req.cookies.previouslyViewed);
      const findProduct = await Product.findOne({ _id: productId });
      const pageObject = { product: findProduct };
      req.cookies.previouslyViewed.push(pageObject);

      console.log("PREVIOUSLLLYYY", req.cookies.previouslyViewed);
      next();
    }
  } catch (err) {
    res.status(400).json({
      status: "FAILEEED",
      error: err,
    });
  }
};

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: "Helllo",
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: req.flash("signup-error"),
    userValues: "",
    wrongInput: [],
  });
};

// exports.protect = (req, res, next) => {
//   if (req.session.isLoggedIn && req.session.user) {
//     return next();
//   } else {
//     res.redirect("/");
//     next();
//   }
// };
