import path from "path";
import executeCommand from "../utils/executeCommand.js";
import ensureDirectoryExistence from "../utils/ensureDirectoryExistence.js";

export async function videosData({ inputPath, outputPath }) {
  ensureDirectoryExistence(path.dirname(outputPath));
  const ffmpegCommand = `ffmpeg -i "${inputPath}" -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${path.dirname(
    outputPath
  )}/segment%03d.ts" -start_number 0 "${outputPath}"`;
  await executeCommand(ffmpegCommand);
}

export async function audiosData({ inputPath, outputPath }) {
  ensureDirectoryExistence(path.dirname(outputPath));
  const ffmpegCommand = `ffmpeg -i "${inputPath}" -codec:a libmp3lame -b:a 192k "${outputPath}"`;
  await executeCommand(ffmpegCommand);
}
