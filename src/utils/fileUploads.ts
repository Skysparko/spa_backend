import multer from "multer";

import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/user_image");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.mobile_no + Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 100000 * 100 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpg|png|jpeg|bmp/;
    const extname = fileTypes.test(path.extname(file.originalname));
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Please provide an image."));
    }
  },
}).single("file");

// module.exports = upload;