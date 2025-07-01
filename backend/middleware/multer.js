const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/images");
  },
  filename: (req, file, cb) => {
    let dateSuffix = Date.now();
    const ext = path.extname(file.originalname).toLocaleLowerCase();
    const filename = path.parse(file.originalname).name;
    console.log(path.parse(file.originalname));
    cb(null, filename + "-" + dateSuffix + ext);
  },
});
module.exports = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});
