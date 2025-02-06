import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Routes, Route, Link } from "react-router-dom";
import { FiUpload, FiSun, FiMoon } from "react-icons/fi";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import { ThemeContext } from "./context/ThemeContext";
import MediaList from "./components/MediaList";
import UploadForm from "./components/UploadForm";
import MediaDetail from "./components/MediaDetail";
import GalleryDetail from "./components/GalleryDetail";
import VideoDetail from "./components/VideoDetail";
import AudioDetail from "./components/AudioDetail";

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 bg-gradient-to-br ${
        theme === "dark"
          ? "from-gray-800 to-gray-900"
          : "from-gray-50 to-gray-100"
      }`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-sky-400">
              MediaHub
            </span>
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="text-xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? (
              <FiSun className="text-yellow-400" />
            ) : (
              <FiMoon className="text-gray-800 dark:text-gray-200" />
            )}
          </button>

          {/* Hamburger Icon (Mobile) */}
          <button
            className="text-3xl z-50 md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <RiCloseLine className="text-cyan-400 dark:text-gray-200" />
            ) : (
              <RiMenuLine className="text-cyan-400 dark:text-gray-200" />
            )}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/gallery" label="Gallery" />
            <NavLink to="/video" label="Videos" />
            <NavLink to="/audio" label="Audio" />
            <Link
              to="/upload"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 transition-all shadow-lg"
            >
              <FiUpload className="w-5 h-5 mr-2" />
              Upload
            </Link>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed inset-0 bg-white dark:bg-gray-900 z-40 flex flex-col items-center justify-center space-y-6 transition-opacity duration-300 ease-in-out opacity-100 md:hidden">
            <NavLink to="/gallery" label="Gallery" onClick={toggleMenu} />
            <NavLink to="/video" label="Videos" onClick={toggleMenu} />
            <NavLink to="/audio" label="Audio" onClick={toggleMenu} />
            <Link
              to="/upload"
              onClick={toggleMenu}
              className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 transition-transform transform hover:scale-105 shadow-xl"
            >
              <FiUpload className="w-5 h-5 mr-2" />
              Upload
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<MediaList />} />
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/audio" element={<AudioDetail />} />
          <Route path="/video" element={<VideoDetail />} />
          <Route path="/gallery" element={<GalleryDetail />} />
          <Route path="/media/:id" element={<MediaDetail />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-300">
            © {new Date().getFullYear()} MediaHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// NavLink Component with PropTypes
const NavLink = ({ to, label, onClick = () => {} }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block md:inline-block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group"
  >
    {label}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
  </Link>
);
NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default App;
