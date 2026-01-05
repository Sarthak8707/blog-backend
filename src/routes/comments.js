import express from "express";
import { getComments, createComments, deleteComment } from "../controllers/comments.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router=express.Router();

router.get("posts/:id/comments", getComments);
router.post("posts/:id/comments",authMiddleware, createComments);
router.delete("/comments/:id",authMiddleware, deleteComment);

export {router as commentsRouter}