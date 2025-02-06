import { createContext, memo, useState } from "react";
import PropTypes from "prop-types";

export const MediaDataContext = createContext();

const MediaContext = ({ children }) => {
  const [media, setMedia] = useState([]); // ✅ Changed from null to []
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateMedia = (mediaData) => {
    setMedia(mediaData);
  };

  const value = {
    media,
    setMedia,
    isLoading,
    setIsLoading,
    error,
    setError,
    updateMedia,
  };

  return (
    <MediaDataContext.Provider value={value}>
      {children}
    </MediaDataContext.Provider>
  );
};

MediaContext.propTypes = {
  children: PropTypes.node.isRequired,
};

export default memo(MediaContext);
