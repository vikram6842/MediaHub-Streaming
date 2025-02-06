import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import ensureDirectoryExistence from "../utils/ensureDirectoryExistence.js";
import { UPLOAD_BASE_PATH } from "../utils/fileUtils.js";

const mediaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["video", "audio", "image"], required: true },
    path: { type: String, required: true },
    lessonId: { type: String, required: false },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const mimeMap = {
      "image/jpeg": "images",
      "image/png": "images",
      "audio/mpeg": "audios",
      "audio/wav": "audios",
      "video/mp4": "videos",
    };

    const folder = mimeMap[file.mimetype];
    if (!folder) return cb(new Error("Unsupported file type"), false);

    const uploadPath = path.join(UPLOAD_BASE_PATH, folder);
    ensureDirectoryExistence(uploadPath);

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${file.fieldname}-${uuidv4()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueFilename);
  },
});

// File filter for supported types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "audio/mpeg",
    "audio/wav",
    "video/mp4",
  ];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Unsupported file type"), false);
  }
  cb(null, true);
};

// Multer setup
const upload = multer({
  storage,
  fileFilter,
});

mediaSchema.statics.uploadFile = upload.single("mediaFile");

const Media = mongoose.model("Media", mediaSchema);
export default Media;
