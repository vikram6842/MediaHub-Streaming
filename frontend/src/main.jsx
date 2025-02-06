import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import MediaContext from "./context/MediaContext.jsx";
import ThemeProvider from "./context/ThemeContext.jsx";

const App = lazy(() => import("./App.jsx")); // Lazy load App

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <MediaContext>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <App />
          </Suspense>
        </BrowserRouter>
      </MediaContext>
    </ThemeProvider>
  </StrictMode>
);
