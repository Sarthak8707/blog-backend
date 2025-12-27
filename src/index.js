import express from "express";
import cors from 'cors';
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(cors());


mongoose.connect("mongodb+srv://firstuser:1234@blog-data.poilf5c.mongodb.net/blogs?appName=blog-data")




const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}` )
})