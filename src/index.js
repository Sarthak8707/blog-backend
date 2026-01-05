import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from "dotenv";
import { PostModel } from "./models/Posts.js";
import { userRouter } from "./routes/auth.js";
import { postsRouter } from "./routes/posts.js";
import { commentsRouter } from "./routes/comments.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI)

app.use("/auth", userRouter)

app.use("/posts", postsRouter);

app.use("/", commentsRouter);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}` )
})