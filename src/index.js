import express from "express";
import cors from 'cors';

import { createClient } from "redis";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { PostModel } from "./models/Posts.js";
import { userRouter } from "./routes/auth.js";
import { postsRouter } from "./routes/posts.js";
import { commentsRouter } from "./routes/comments.js";
import { likesRouter } from "./routes/likes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// mongoose connection
try{
 
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected")
}
catch(err){
    console.log(err)
}

// redis connection


export const redis = createClient({
  url: "redis://localhost:6379",
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

await redis.connect();


// routers
app.use("/auth", userRouter)

app.use("/posts", postsRouter);

app.use("/", commentsRouter);

app.use("/like", likesRouter);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}` )
})