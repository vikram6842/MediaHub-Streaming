import fs from "fs";
import path from "path";
import mime from "mime-types";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getMimeType = (filePath, defaultType) =>
  mime.lookup(filePath) || defaultType;

export const streamMediaFile = (req, res, filePath) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  const mimeType = getMimeType(filePath, "application/octet-stream");

  if (range) {
    const [start, end] = range
      .replace(/bytes=/, "")
      .split("-")
      .map(Number);
    const chunkStart = start || 0;
    const chunkEnd = end || fileSize - 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkEnd - chunkStart + 1,
      "Content-Type": mimeType,
    });

    fs.createReadStream(filePath, { start: chunkStart, end: chunkEnd }).pipe(
      res
    );
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": mimeType,
    });
    fs.createReadStream(filePath).pipe(res);
  }
};

export const cleanMediaName = (name) => {
  return name
    .replace(/\s*[\(\[].*?[\)\]]|\s*-\s*\d+Kbps|\s*\.\w+$/g, "")
    .trim();
};

export const UPLOAD_BASE_PATH = path.join(__dirname, "..", "uploads");
