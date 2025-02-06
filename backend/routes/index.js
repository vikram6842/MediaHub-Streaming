import express from "express";
import mediaRoutes from "./mediaRoutes.js";

const router = express.Router();

router.use("/api/media", mediaRoutes);

export default router;
