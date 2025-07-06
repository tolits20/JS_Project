const multer = require("multer");
const path = require("path");

const filePaths = {
  user: "storage/images",
  item: {
    main: "storage/items/main",
    gallery: "storage/items/gallery",
  },
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log("start", req.params.flag, "<=>", file, "end");
    let dest;
    if (req.params.flag == undefined || req.params.flag == null) {
      dest = filePaths.user;
    } else {
      dest = req.params.flag ==="item" ?  filePaths.item.main : filePaths.item.gallery;
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    let dateSuffix = Date.now();
    const ext = path.extname(file.originalname).toLocaleLowerCase();
    const filename = path.parse(file.originalname).name;

    cb(null, filename + "-" + dateSuffix + ext);
  },
});
module.exports = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLocaleLowerCase();
    if (ext !== "jpg" || ext !== "jpeg" || ext !== "png") cb(null, false);
    cb(null, true);
  },
});
