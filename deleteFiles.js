const fs = require("fs");

module.exports = (path) => {
  return fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
