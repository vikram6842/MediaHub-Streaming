import fs from "fs";
import path from "path";

export default function ensureDirectoriesExistence(dirs) {
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}
