import { redis } from "../index.js";
import { CommentModel } from "../models/Comments.js"
import { PostModel } from "../models/Posts.js";
import { AppError } from "../utils/appError.js";

export const getCommentsOfPost = async ({postId}) => {

    // check for cache
    const cacheKey = `comments:${postId}`;
    try{
    
    const cachedValue = await redis.get(cacheKey);
    if(cachedValue) return JSON.parse(cachedValue);

    }
    catch(err){
        console.log("Redis error:", err);
    }

    // get from db

    const post = await PostModel.findOne({_id: postId});
    if(!post){
        throw new AppError("Post doesn't exists", 404);
    }
    const result = await CommentModel.find({postId});

    // update cache
    
    try{
        await redis.setEx(cacheKey, 60, JSON.stringify(result));
    }
    catch(err){
        console.log("Redis error:", err);
    }


    return result;
}

export const createAComment = async ({userId, content, postId}) => {

    // add to db

    const post = await PostModel.findOne({_id: postId});
    if(!post){
        throw new AppError("Post doesn't exist", 404);

    }
    if(!content){
        throw new AppError("Content must not be Empty", 400);
    }
    const newComment = new CommentModel({userId, content, postId});
    await newComment.save();

    // invalidate cache

    try{
        await redis.del(`comments:${postId}`);
    }
    catch(err){
        console.log("Redis error:", err);
    }

    
    return newComment;

}

export const deleteCommentOfUser = async ({commentId, userId}) => {

    // delete from db
    const comment = await CommentModel.findById(commentId);
    const postId = comment.postId;
    if(!comment){
        throw new AppError("Comment doesn't exist", 404);
    }

    if(comment.userId.toString() != userId){
        throw new AppError("You are not allowed to delete this comment!", 403);
    }
    await comment.deleteOne();

    // invalidate cache

    try{
      await redis.del(`comments:${postId}`);
    }
    catch(err){

    }

}
