export default function getDirectoryForFileType(fileType, filename) {
  switch (fileType) {
    case "image":
      return path.join(UPLOAD_BASE_PATH, process.env.IMAGE, filename);
    case "audio":
      return path.join(UPLOAD_BASE_PATH, process.env.AUDIO, filename);
    case "video":
      return path.join(UPLOAD_BASE_PATH, process.env.VIDEO, filename);
    default:
      return null;
  }
}
