import axios from "axios";

// Upload Media
export const uploadMedia = async (formData) => {
  try {
    const response = await axios.post(
      "https://mediahub-streaming.onrender.com/api/media/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch All Media
export const fetchAllMedia = async () => {
  try {
    const response = await axios.get(
      "https://mediahub-streaming.onrender.com/api/media"
    );
    return response;
  } catch (error) {
    console.error(
      "Failed to fetch all media:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch Media by ID
export const fetchMediaById = async (id) => {
  try {
    const response = await axios.get(
      `https://mediahub-streaming.onrender.com/api/media/${id}`
    );
    return response;
  } catch (error) {
    console.error(
      `Failed to fetch media with ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Stream Video (return direct URL)
export const streamVideo = (lessonId) => {
  return `https://mediahub-streaming.onrender.com/api/media/videos/stream/${lessonId}`;
};

// ✅ Stream Audio (return direct URL)
export const streamAudio = (lessonId) => {
  return `https://mediahub-streaming.onrender.com/api/media/audios/stream/${lessonId}`;
};

// Get serve Image (return direct URL)
export const serveImage = (lessonId) => {
  return `https://mediahub-streaming.onrender.com/api/media/images/serve/${lessonId}`;
};
