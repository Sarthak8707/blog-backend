import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
    postId: {type: mongoose.Schema.Types.ObjectId, ref: "posts" },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    createdAt: {type: Date}
})