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

dotenv.config();

if (
  !process.env.PORT ||
  !process.env.CORS_ORIGIN ||
  !process.env.UPLOAD_DIR ||
  !process.env.VIDEO_DIR ||
  !process.env.IMAGE_DIR ||
  !process.env.AUDIO_DIR
) {
  console.error("Missing required environment variables!");
  process.exit(1); // Exit if essential env variables are missing
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 8000;

const app = express();

// Apply helmet globally with custom configuration
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable Content Security Policy if causing issues
    crossOriginEmbedderPolicy: false, // Disable cross-origin embedder policy
    crossOriginOpenerPolicy: false, // Disable cross-origin opener policy
    crossOriginResourcePolicy: false, // Disable cross-origin resource policy
    xssFilter: false, // Disable XSS protection if causing issues
  })
);

app.use(morgan("combined"));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// CORS options
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDB();

app.use(
  "/uploads",
  express.static(path.join(__dirname, process.env.UPLOAD_DIR), {
    maxAge: "1d",
  })
);

// Serve video streams with appropriate headers and CORS settings
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

app.use("/", routes);

app.use(errorHandler);

const shutdown = () => {
  console.log("Shutting down gracefully...");
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
