import express from "express"
import { create, listPosts } from "../controllers/posts.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// List all posts
router.get("/", listPosts);

// Create a post
router.post("/", create);


export {router as postsRouter}