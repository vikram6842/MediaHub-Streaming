import express from "express";
import {
  uploadMedia,
  getAllMedia,
  getMediaById,
  streamMedia,
  serveImage,
  streamAudio,
} from "../controller/mediaController.js";
import { preventDownload, allowControl } from "../middleware/allowControl.js";

const router = express.Router();

// Route for uploading media
router.post("/upload", allowControl, uploadMedia);

// Route for fetching all media
router.get("/", preventDownload, getAllMedia);

// Route for fetching a specific media by ID
router.get("/:id", preventDownload, getMediaById);

// Route for streaming video
router.get("/videos/stream/:lessonId", preventDownload, streamMedia);

// Route for serving images
router.get("/images/serve/:lessonId", preventDownload, serveImage);

// Route for streaming audio
router.get("/audios/stream/:lessonId", preventDownload, streamAudio);

export default router;
