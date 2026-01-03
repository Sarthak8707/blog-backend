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

export const getPostData = async (id) => {
    const data = await PostModel.findOne({_id: id});
    return data;
}

export const updatePost = async({userId, postId, title, content}) => {
    const post = await PostModel.findById(postId);
    if(!post){
        throw new AppError("Post not found", 404);
    }

   // console.log(post.authorId)
    if(post.authorId.toString() != userId){
        throw new AppError("You are not allowed to update this post", 403);
    }
    if(title !== undefined) post.title = title;
    if(content !== undefined) post.content = content;

    await post.save();

    return post;

}

export const deletePost = async ({role, postId}) => {
    const post = await PostModel.findById(postId);

    if(role !== "admin"){
        throw new AppError("You are not allowed to delete the post", 403);
    }
    if(!post){
        throw new AppError("Post does not exist", 404);
    }
    await post.deleteOne();
    return post;

}