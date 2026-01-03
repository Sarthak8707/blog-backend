import express from "express"
import { create, deletePostCon, getPost, listPosts, update } from "../controllers/posts.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// List all posts
router.get("/", listPosts);

// Create a post
router.post("/", authMiddleware , create);

// Get a post 
router.get("/:id", getPost);

// Update a post
router.put("/:id", authMiddleware, update);

// Delete a post 
router.delete("/:id", authMiddleware, deletePostCon);


export {router as postsRouter}