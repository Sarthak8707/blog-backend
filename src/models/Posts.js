import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {type: String},
    content: {type: String},
    authorId: {type: mongoose.Schema.Types.ObjectId, ref: "users" },
    tags: {type: [String]},
    likesCount: {type: Number},
    isPublished: {type: Boolean},
    createdAt: {type: Date},
    updatedAt: {type: Date}

})

export const PostModel = mongoose.model("posts", PostSchema);