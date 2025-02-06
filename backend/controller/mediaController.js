import Media from "../models/media.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import ensureDirectoriesExistence from "../utils/ensureDirectories.js";
import serviceData from "../service/serviceData.js";
import { handleError } from "../middleware/errorHandler.js";
import {
  handleImageUpload,
  handleAudioUpload,
  handleVideoUpload,
} from "../service/helperHandler.js";
import {
  getMimeType,
  streamMediaFile,
  cleanMediaName,
  UPLOAD_BASE_PATH,
} from "../utils/fileUtils.js";
import { asyncHandler } from "../middleware/allowControl.js";

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!process.env.IMAGE || !process.env.VIDEO || !process.env.AUDIO) {
    console.error("Missing required environment variables!");
    process.exit(1); // Exit if essential env variables are missing
  }
  try {
    const directories = [
      process.env.IMAGE,
      process.env.VIDEO,
      process.env.AUDIO,
    ].map((dir) => path.join(UPLOAD_BASE_PATH, dir));

    ensureDirectoriesExistence(directories);

    Media.uploadFile(req, res, async (err) => {
      if (err)
        return res.status(400).json({ success: false, message: err.message });

      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });

      const { originalname, mimetype, filename, path: tempPath } = req.file;
      const fileType = mimetype.split("/")[0];
      const lessonId = uuidv4();

      let mediaUrl;
      switch (fileType) {
        case "image":
          mediaUrl = await handleImageUpload(filename, tempPath);
          break;
        case "audio":
          mediaUrl = await handleAudioUpload(lessonId, tempPath);
          break;
        case "video":
          mediaUrl = await handleVideoUpload(lessonId, tempPath);
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Unsupported file type" });
      }

      const media = await serviceData({
        originalname: cleanMediaName(originalname),
        fileType,
        path: mediaUrl,
        lessonId,
      });

      res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        media,
      });
    });
  } catch (error) {
    handleError(res, error, "Upload");
  }
});
export const streamMedia = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const media = await Media.findOne({ lessonId });
  if (!media)
    return res.status(404).json({ success: false, message: "Media not found" });

  const filePath = path.normalize(
    path.join(UPLOAD_BASE_PATH, media.path.replace(/^\/uploads/, ""))
  );
  streamMediaFile(req, res, filePath);
});

export const getAllMedia = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = Math.max(parseInt(page, 10), 1);
  const limitNum = Math.max(parseInt(limit, 10), 1);

  const mediaFiles = await Media.find()
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res
    .status(200)
    .json({ success: true, message: "All media files", mediaFiles });
});

// Get media file by ID
export const getMediaById = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media)
    return res.status(404).json({ success: false, message: "Media not found" });
  res.status(200).json({ success: true, media });
});

// Serve image
export const serveImage = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const media = await Media.findOne({ lessonId });
  if (!media)
    return res.status(404).json({ success: false, message: "Media not found" });

  const imagePath = path.normalize(
    path.join(UPLOAD_BASE_PATH, media.path.replace(/^\/uploads/, ""))
  );
  if (!fs.existsSync(imagePath))
    return res.status(404).json({ success: false, message: "File not found" });

  res.sendFile(path.resolve(imagePath));
});

// Stream audio
export const streamAudio = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const media = await Media.findOne({ lessonId });
  if (!media)
    return res.status(404).json({ success: false, message: "Media not found" });

  const filePath = path.join(
    UPLOAD_BASE_PATH,
    media.path.replace(/^\/uploads/, "")
  );
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "audio/mpeg",
    });

    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "audio/mpeg",
    });
    fs.createReadStream(filePath).pipe(res);
  }
});
