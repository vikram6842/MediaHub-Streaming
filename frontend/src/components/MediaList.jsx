import { useContext, useEffect, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { MediaDataContext } from "../context/MediaContext";
import { fetchAllMedia } from "../services/api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MediaList = () => {
  const { media, setMedia, isLoading, setIsLoading, error, setError } =
    useContext(MediaDataContext);

  const getMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchAllMedia();
      setMedia(data.mediaFiles);
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 dark:bg-gray-900 dark:text-white">
        <div className="text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-300 p-4 rounded-xl">
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

  if (!Array.isArray(media) || media.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-900 dark:text-white">
        <p className="text-lg">
          No media found.{" "}
          <Link
            to="/upload"
            className="text-blue-500 hover:underline dark:text-blue-400"
          >
            Upload some!
          </Link>
        </p>
      </div>
    );

  return (
    <div className="space-y-8 dark:bg-gray-900 dark:text-gray-200 p-4">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-3xl font-bold">Welcome to MediaHub</h1>
        <p className="mt-2">
          Your centralized hub for managing and enjoying all types of media
          content
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square">
              <Skeleton
                className="h-full w-full rounded-xl"
                baseColor="#374151"
                highlightColor="#4B5563"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <Link
              key={item._id}
              to={`/media/${item._id}`}
              className="group relative block aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 transition-transform hover:scale-105 hover:shadow-xl"
            >
              {item.type === "image" && (
                <img
                  src={`http://localhost:8000${item.path}`}
                  alt={item.name}
                  className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                />
              )}
              {item.type === "video" && (
                <div className="flex h-full items-center justify-center bg-gray-800">
                  <svg
                    className="h-12 w-12 text-white/50"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.54 9L8.88 3.46a3.42 3.42 0 00-5.13 3v11.12A3.42 3.42 0 007.17 21a3.43 3.43 0 001.71-.46L18.54 15a3.42 3.42 0 000-5.92z" />
                  </svg>
                </div>
              )}
              {item.type === "audio" && (
                <div className="flex h-full items-center justify-center bg-gray-800">
                  <svg
                    className="h-12 w-12 text-white/50"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.54 9L8.88 3.46a3.42 3.42 0 00-5.13 3v11.12A3.42 3.42 0 007.17 21a3.43 3.43 0 001.71-.46L18.54 15a3.42 3.42 0 000-5.92z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div className="text-white">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm opacity-80">{item.type}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(MediaList);
