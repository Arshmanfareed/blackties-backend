const multer = require("multer")
const path = require("path");
const fs = require("fs")

/*upload user profile video */
const mediaStore = multer.diskStorage({
  destination: (req, file, cb) => {
    const { id: userId } = req.user
    const dir = `./public/uploads/${userId}/`
    fs.stat(dir, exist => {
      if (exist) {
        fs.mkdir(dir, () => { })
      }
      cb(null, dir)
    })
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/ /g, "_"));
  }
});
exports.uploadMedia = multer({
  storage: mediaStore,
  limits: {
    fileSize: 150 * 1024 * 1024,  // 50 MB, (max file size)
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /mp4|mov|wmv|x-flv|webm|mkv|quicktime|x-matroska|ogg|avi|jpg|jpeg|png|svg|gif|webp|mp3/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);
    file.extension = path.extname(file.originalname).toLowerCase()
    if (mimeType && extname) {
      return cb(null, true);
    } else {
      cb(null, true);
    }
  }
})