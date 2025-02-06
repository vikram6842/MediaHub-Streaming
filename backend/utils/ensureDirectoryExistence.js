import fs from "fs";
import path from "path";

const ensureDirectoryExistence = (dirPath) => {
  if (!dirPath) {
    throw new Error("Directory path is required");
  }

  const fullDirPath = path.resolve(dirPath); // Resolving the absolute path
  if (!fs.existsSync(fullDirPath)) {
    fs.mkdirSync(fullDirPath, { recursive: true }); // Create all directories in the path recursively
  }
};

export default ensureDirectoryExistence;
