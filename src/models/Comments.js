import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    postId:{type:  mongoose.Schema.Types.ObjectId, ref: "posts"},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    content: {type: String},
    createdAt: {type: Date}
})

export const CommentModel = mongoose.model("comments", CommentSchema)