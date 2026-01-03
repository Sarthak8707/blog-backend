import express from "express"
import { create, getPost, listPosts } from "../controllers/posts.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// List all posts
router.get("/", listPosts);

// Create a post
router.post("/", authMiddleware , create);

// Get a post 
router.get("/:id", getPost);


export {router as postsRouter}