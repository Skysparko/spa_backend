import multer from "multer";
import path from "path";
import { UPLOAD_PATH_FOR_USERS } from "./commonConstants";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_PATH_FOR_USERS);
  },
  filename: (req, image, cb) => {
    cb(null, req.body.mobile_no + "_" + Date.now() + path.extname(image.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 100000 * 100 },
  fileFilter: (req, image, cb) => {
    const fileTypes = /jpg|png|jpeg|bmp/;
    const extname = fileTypes.test(path.extname(image.originalname));
    const mimetype = fileTypes.test(image.mimetype); 
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Please provide an image."));
    }
  },
}).single("image");

// module.exports = upload;