import path from "path";
import fs from "fs";
import { videosData, audiosData } from "../media/media.js";
import ensureDirectoriesExistence from "../utils/ensureDirectories.js";
import { UPLOAD_BASE_PATH } from "../utils/fileUtils.js";

// Helper functions for file handling
export const handleImageUpload = (filename, tempPath) => {
  if (!process.env.IMAGE_DIR || !process.env.IMAGE) {
    console.error("Missing required environment variables!");
    process.exit(1); // Exit if essential env variables are missing
  }
  const targetPath = path.join(UPLOAD_BASE_PATH, process.env.IMAGE, filename);
  fs.renameSync(tempPath, targetPath);
  return `/${process.env.IMAGE_DIR}/${filename}`;
};

export const handleAudioUpload = async (lessonId, tempPath) => {
  if (!process.env.AUDIO || !process.env.AUDIO_DIR) {
    console.error("Missing required environment variables!");
    process.exit(1); // Exit if essential env variables are missing
  }
  const audioDir = path.join(UPLOAD_BASE_PATH, process.env.AUDIO, lessonId);
  ensureDirectoriesExistence([audioDir]);

  const targetPath = path.join(audioDir, `${lessonId}.mp3`);
  await audiosData({ inputPath: tempPath, outputPath: targetPath });
  return `/${process.env.AUDIO_DIR}/${lessonId}/${lessonId}.mp3`;
};

export const handleVideoUpload = async (lessonId, tempPath) => {
  if (!process.env.VIDEO || !process.env.VIDEO_DIR) {
    console.error("Missing required environment variables!");
    process.exit(1); // Exit if essential env variables are missing
  }
  const videoDir = path.join(UPLOAD_BASE_PATH, process.env.VIDEO, lessonId);
  ensureDirectoriesExistence([videoDir]);

  const targetPath = path.join(videoDir, "index.m3u8");
  await videosData({ inputPath: tempPath, outputPath: targetPath });
  return `/${process.env.VIDEO_DIR}/${lessonId}/index.m3u8`;
};
