import { LikeModel } from "../models/Likes.js";
import { PostModel } from "../models/Posts.js"
import { AppError } from "../utils/appError.js";

export const likeByUser = async ({postId, userId}) => {
    const post = await PostModel.findOne({_id: postId});
    if(!post){
        throw new AppError("Post doesn't exist", 404);
    }
    const like = await LikeModel({postId, userId});
    if(like){
        throw new AppError("You cant like twice", 409);
    }
    const newLike = new LikeModel({postId, userId});
    await newLike.save();
}

export const deleteLikeByUser = async ({postId, userId}) => {
    const post = await PostModel.findOne({_id: postId});
    if(!post){
        throw new AppError("Post doesn't exist", 404);
    }
    const like = await LikeModel.findById({userId, postId});
    if(!like){
        throw new AppError("you cant unlike twice", 409);
    }
    await like.deleteOne();
}