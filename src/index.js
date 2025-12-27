import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from "dotenv";
import { PostModel } from "./models/Posts.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI)



const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}` )
})