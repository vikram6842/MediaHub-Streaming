import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 500, // Adjust chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor-react"; // Separate React-related dependencies
            if (id.includes("lodash")) return "vendor-lodash"; // Separate lodash (if used)
            return "vendor"; // Other third-party dependencies
          }
        },
      },
    },
  },
  server: {
    host: "0.0.0.0", // Ensure Vite binds to all network interfaces
    port: 5173, // Custom port (optional)
    strictPort: true, // Prevent Vite from using random ports if 5173 is busy
  },
});
