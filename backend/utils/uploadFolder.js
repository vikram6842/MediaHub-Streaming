import path from "path";

const uploadFolder = (basePath, folder) => {
  return path.join(basePath, folder);
};

export default uploadFolder;
