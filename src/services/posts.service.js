import { PostModel } from "../models/Posts.js"
import { AppError } from "../utils/appError.js";

export const listAllPosts = async () => {
    const posts = await PostModel.find();
    return posts;
}

export const createPost = async ({authorId, title, content}) => {
    if(!title || !content){
        throw new AppError("Title and Post are required", 400);
    }
    const newPost = new PostModel({authorId, title, content});
    await newPost.save();
    return newPost;


}