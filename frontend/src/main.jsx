import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import MediaContext from "./context/MediaContext.jsx";
import ThemeProvider from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <MediaContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MediaContext>
    </ThemeProvider>
  </StrictMode>
);
