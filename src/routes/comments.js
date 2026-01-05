import express from "express";
import { getComments, createComments, deleteComment } from "../controllers/comments.controller.js";

const router=express.Router();

router.get("/:id/comments", getComments);
router.post("/:id/comments", createComments);
router.delete("/comments/:id", deleteComment);

export {router as commentsRouter}