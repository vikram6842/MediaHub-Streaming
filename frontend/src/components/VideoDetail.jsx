import { useEffect, useState, useContext, useCallback, memo } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { fetchAllMedia } from "../services/api";
import { MediaDataContext } from "../context/MediaContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const VideoDetail = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const { setMedia, isLoading, setIsLoading, error, setError } =
    useContext(MediaDataContext);

  const getMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchAllMedia();
      setMedia(data.mediaFiles);
      const images = data.mediaFiles.filter((item) => item.type === "video");
      setMediaFiles(images);
    } catch (err) {
      setError("Failed to load media: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [setMedia, setIsLoading, setError]);

  useEffect(() => {
    getMedia();
  }, [getMedia]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300 p-4 rounded-xl">
          <p className="font-medium">{error}</p>
        </div>
        <button
          onClick={getMedia}
          className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!Array.isArray(mediaFiles) || mediaFiles.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p className="text-lg">
          No media found.{" "}
          <Link
            to="/upload"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Upload some!
          </Link>
        </p>
      </div>
    );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 p-4">
        <div className="text-red-500 bg-red-50 p-4 rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-center mt-4 font-medium">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8 dark:bg-gray-900  dark:text-gray-200 p-4">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-gray-900"> Video </h1>
        <p className="mt-2 ">Browse through all uploaded media files</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span className="hover:underline">Back to Gallery</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaFiles.map((item) => (
            <Link
              key={item._id}
              to={`/media/${item._id}`}
              className="group relative block aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 transition-transform hover:scale-105 hover:shadow-md"
            >
              <div className="flex h-full items-center justify-center bg-gray-800">
                <svg
                  className="h-12 w-12 text-white/50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.54 9L8.88 3.46a3.42 3.42 0 00-5.13 3v11.12A3.42 3.42 0 007.17 21a3.43 3.43 0 001.71-.46L18.54 15a3.42 3.42 0 000-5.92zm-1 4.19l-9.66 5.62a1.44 1.44 0 01-1.42 0 1.42 1.42 0 01-.71-1.23V6.42a1.42 1.42 0 01.71-1.23A1.51 1.51 0 017.17 5a1.54 1.54 0 01.71.19l9.66 5.58a1.42 1.42 0 010 2.46z" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div className="text-white truncate">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm opacity-80">{item.type}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && mediaFiles.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <div className="text-center space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">
              No media found
            </h3>
            <p className="text-gray-500">Get started by uploading a new file</p>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload Media
          </Link>
        </div>
      )}
    </div>
  );
};

export default memo(VideoDetail);
