import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import connectToDB from "./config/mongoose.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "PORT",
  "CORS_ORIGIN",
  "UPLOAD_DIR",
  "VIDEO_DIR",
  "IMAGE_DIR",
  "AUDIO_DIR",
];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingVars.join(", ")}`
  );
  process.exit(1); // Exit the application
}

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Apply security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    xssFilter: false,
  })
);

// Logging middleware
app.use(morgan("combined"));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
});
app.use(limiter);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(","), // Convert comma-separated string into an array
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If you are using cookies or authentication
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectToDB();

// Static file serving
app.use(
  "/uploads",
  express.static(path.join(__dirname, process.env.UPLOAD_DIR), {
    maxAge: "1d",
  })
);

// Serve video streams
app.use(
  "/api/media/videos/stream",
  express.static(path.join(__dirname, process.env.VIDEO_DIR), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".m3u8")) {
        res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      } else if (filePath.endsWith(".ts")) {
        res.setHeader("Content-Type", "video/mp2t");
      }
      res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
    },
    fallthrough: true,
  })
);

// Main Routes
app.use("/", routes);

// Error Handling Middleware
app.use(errorHandler);

// Graceful Shutdown
const shutdown = () => {
  console.log("🛑 Shutting down gracefully...");
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
