const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.body, file);
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
    console.log("here", file);
    const ext = path.extname(file.originalname).toLocaleLowerCase();
    if (ext !== "jpg" || ext !== "jpeg" || ext !== "png") cb(null, false);
    cb(null, true);
  },
});
