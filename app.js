const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config({ path: "./config.env" });
const errorController = require("./controller/error");
const csurf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const app = express();
const cookieParser = require("cookie-parser");
const merchRoutes = require("./routes/merchantRoutes");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes");
const merchRoutesApi = require("./routes/merchantRoutesApi");
const authRoutesApi = require("./routes/authRoutesApi");
const userRoutesApi = require("./routes/userRoutesApi");
const cors = require("cors");
const cron = require("./Cron/cronJob");
const morgan = require("morgan");

const errorAll = require("./controller/error.js");

const errorMiddleware = require("./errorMiddleware.js");
app.set("view engine", "ejs");
app.set("views", "views");

//multer filter logic to filter out filetypes
const setfileType = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//multer file storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  multer({ storage: fileStorage, fileFilter: setfileType }).single("imageUrl")
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(
  cors({
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
  })
); // Use this after the variable declaration

// app.use(csurf({ cookie: true }));
// app.use(flash());

// //now to make sure it is present in all rendered routes instead of entering it manually

// app.use((req, res, next) => {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

// app.all("*", (req, res, next) => {
//   return errorAll.get404;
// });

app.use(errorMiddleware);

app.use("/Mercado", merchRoutes);
app.use(userRoutes);
app.use(authRoutes);
app.use("/api/v1", userRoutesApi);
app.use("/api/v1", merchRoutesApi);
app.use("/api/v1", authRoutesApi);
module.exports = app;
