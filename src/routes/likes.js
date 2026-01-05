import express from "express";
import { deleteLike, postLike } from "../controllers/likes.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/posts/:id",authMiddleware, postLike);

router.delete("/posts/:id",authMiddleware, deleteLike);

export {router as likesRouter}