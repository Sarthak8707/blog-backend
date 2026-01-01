import { PostModel } from "../models/Posts.js"

export const listAllPosts = async () => {
    const posts = await PostModel.find();
    return posts;
}

export const createPost = async () => {
    
}