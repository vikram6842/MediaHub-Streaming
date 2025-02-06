import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/media`,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Upload Media
export const uploadMedia = async (formData) => {
  try {
    const response = await API.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch All Media
export const fetchAllMedia = async () => {
  try {
    const response = await API.get("/");
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
    const response = await API.get(`/${id}`);
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
  return `${import.meta.env.VITE_BASE_URL}/api/media/videos/stream/${lessonId}`;
};

// ✅ Stream Audio (return direct URL)
export const streamAudio = (lessonId) => {
  return `${import.meta.env.VITE_BASE_URL}/api/media/audios/stream/${lessonId}`;
};

// Get serve Image (return direct URL)
export const serveImage = (lessonId) => {
  return `${import.meta.env.VITE_BASE_URL}/api/media/images/serve/${lessonId}`;
};
