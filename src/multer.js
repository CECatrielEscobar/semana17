import multer from "multer";
import __dirname from "./utils.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/public/images`);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ".png");
  },
});

const upload = multer({ storage: storage });

export default upload;
