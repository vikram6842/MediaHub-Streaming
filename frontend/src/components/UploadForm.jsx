import { memo, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MediaDataContext } from "../context/MediaContext";
import { uploadMedia } from "../services/api";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New state to track upload status
  const { setIsLoading, setError } = useContext(MediaDataContext);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("mediaFile", file);

    try {
      setIsUploading(true); // Set uploading state to true
      setIsLoading(true);
      await uploadMedia(formData);
      setIsLoading(false);
      setIsUploaded(true); // Mark as uploaded
      setFile(null); // Clear file after upload
      navigate("/");
    } catch (err) {
      setError("Failed to upload media: " + err.message);
      setIsLoading(false);
    } finally {
      setIsUploading(false); // Reset uploading state after the upload
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upload Media
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Supported formats: JPEG, PNG, MP4, MP3
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors dark:border-gray-500 dark:hover:border-blue-400 ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                : "border-gray-300 hover:border-blue-400 dark:hover:border-blue-400"
            }`}
          >
            <div className="text-center space-y-3">
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="sr-only"
                required
                disabled={isUploaded || isUploading} // Disable if uploading or uploaded
              />
              <label
                htmlFor="file"
                className={`relative cursor-pointer rounded-md font-medium ${
                  isUploaded
                    ? "text-gray-400"
                    : "text-blue-600 hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-200"
                } focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500`}
              >
                <span>{isUploaded ? "Upload Complete" : "Choose a file"}</span>
              </label>
              <p className="pl-1">or drag and drop</p>
              {file && !isUploaded && (
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">
                  Selected file: {file.name}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!file || isUploaded || isUploading} // Disable if no file, uploaded, or uploading
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isUploading
              ? "Uploading..."
              : isUploaded
              ? "Uploaded"
              : "Upload File"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(UploadForm);
