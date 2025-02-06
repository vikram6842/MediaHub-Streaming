// serviceData.js
import Media from "../models/media.js";

export default async function serviceData({
  originalname,
  fileType,
  path,
  lessonId,
}) {
  try {
    const media = await Media.create({
      name: originalname,
      type: fileType,
      path,
      lessonId,
    });
    return media;
  } catch (error) {
    console.error("Error saving media:", error);
    throw new Error("Error saving media to database");
  }
}
