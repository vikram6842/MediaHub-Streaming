import { memo, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MediaDataContext } from "../context/MediaContext";
import {
  fetchMediaById,
  streamAudio,
  streamVideo,
  serveImage,
} from "../services/api";
import VideoPlayer from "./VideoPlayer";
import {
  ArrowLeftIcon,
  MusicalNoteIcon,
  FilmIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const MediaDetail = () => {
  const { id } = useParams();
  const { setMedia, isLoading, setIsLoading, error, setError } =
    useContext(MediaDataContext);
  const [media, setLocalMedia] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");

  useEffect(() => {
    const loadMedia = async () => {
      setIsLoading(true);
      try {
        const { data } = await fetchMediaById(id);
        setLocalMedia(data.media);
        setMedia(data.media);

        if (data.media.type === "video") {
          setMediaUrl(`${streamVideo(data.media.lessonId)}`);
        } else if (data.media.type === "audio") {
          setMediaUrl(`${streamAudio(data.media.lessonId)}`);
        } else if (data.media.type === "image") {
          setMediaUrl(`${serveImage(data.media.lessonId)}`);
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadMedia();
  }, [id, setIsLoading, setError, setMedia]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 space-y-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
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
        <p className="text-xl font-medium">{error}</p>
      </div>
    );

  if (!media)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-xl font-medium text-gray-600">No media found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span className="hover:underline">Back to Gallery</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-6 space-x-4">
              {media.type === "image" && (
                <PhotoIcon className="h-8 w-8 text-blue-500" />
              )}
              {media.type === "video" && (
                <FilmIcon className="h-8 w-8 text-blue-500" />
              )}
              {media.type === "audio" && (
                <MusicalNoteIcon className="h-8 w-8 text-blue-500" />
              )}
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 capitalize">
                {media.name}
              </h1>
            </div>

            <div className="relative group">
              {media.type === "image" && (
                <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 p-2 shadow-inner">
                  <img
                    src={
                      mediaUrl ||
                      `${import.meta.env.VITE_BASE_URL}${media.path}`
                    }
                    alt={media.name}
                    className="rounded-lg w-full h-auto object-contain max-h-[70vh] transition-opacity hover:opacity-95"
                  />
                </div>
              )}

              {media.type === "video" && (
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl">
                  <VideoPlayer
                    key={mediaUrl}
                    options={{
                      controls: true,
                      responsive: true,
                      fluid: true,
                      controlsList: "nodownload",
                      controlBar: {
                        volumePanel: { inline: false },
                        pictureInPictureToggle: false,
                      },
                      sources: [
                        {
                          src: mediaUrl,
                          type: "application/x-mpegURL",
                        },
                      ],
                    }}
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg pointer-events-none" />
                </div>
              )}

              {media.type === "audio" && (
                <div className="rounded-xl bg-gray-100 dark:bg-gray-700 p-6 shadow-inner">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <audio
                        controls
                        controlsList="nodownload"
                        className="w-full mt-2"
                        onError={() => setError("Failed to load audio")}
                      >
                        <source src={mediaUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-700 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                  {media.type.toUpperCase()}
                </span>
                <span className="text-sm">
                  Uploaded:{" "}
                  {new Date(media.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {media.fileSize && `Size: ${formatFileSize(media.fileSize)}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format file sizes
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default memo(MediaDetail);
