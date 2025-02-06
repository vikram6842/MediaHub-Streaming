import { useRef, useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import videojs from "video.js";
import "video.js/dist/video-js.css";
// import "videojs-contrib-hls";

const VideoPlayer = ({ options }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize player
    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered");
    videoRef.current.appendChild(videoElement);

    playerRef.current = videojs(videoElement, {
      ...options,
      html5: {
        vhs: {
          overrideNative: true,
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
        },
      },
    });

    playerRef.current.on("play", () => setIsPlaying(true));
    playerRef.current.on("pause", () => setIsPlaying(false));

    return () => {
      // Cleanup
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options]);

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  };

  return (
    <div className="video-player-container relative group w-full max-w-6xl mx-auto shadow-2xl rounded-3xl bg-gradient-to-br from-gray-900 to-black p-2">
      <div
        data-vjs-player
        className="relative z-10 overflow-hidden rounded-2xl"
      >
        <div ref={videoRef} className="aspect-video" />
      </div>

      {/* Play/Pause Button */}
      <div
        onClick={handlePlayPause}
        className="absolute inset-0 flex items-center justify-center z-20 group-hover:bg-black/40 transition-all duration-300 cursor-pointer"
      ></div>
    </div>
  );
};

VideoPlayer.propTypes = {
  options: PropTypes.shape({
    controls: PropTypes.bool,
    responsive: PropTypes.bool,
    fluid: PropTypes.bool,
    sources: PropTypes.arrayOf(
      PropTypes.shape({
        src: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default memo(VideoPlayer);
