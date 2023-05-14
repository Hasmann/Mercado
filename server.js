const app = require("./app");
const dotenv = require("dotenv").config({ path: "./config.env" });
const PORT = process.env.PORT || 3769;
const mongoose = require("mongoose");
const mongoUrl = process.env.MONGODB_CONNECT.replaceAll(
  "<password>",
  process.env.MONGODB_PASSWORD
);
process.on("uncaughtException", (err) => {
  console.log(`UncaughtException :${err}`);
});

mongoose.connect(
  mongoUrl,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("SERVER CONNECTED SUCCESSFULLY");
    }
  }
);

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT:${PORT}....`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, "----", err.message);
  app.close(() => {
    process.exit(1);
  });
});
