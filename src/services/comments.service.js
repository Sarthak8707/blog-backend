import { CommentModel } from "../models/Comments.js"
import { AppError } from "../utils/appError.js";

export const getCommentsOfPost = async ({postId}) => {
    const post = await PostModel.find({_id: postId});
    if(!post){
        throw new AppError("Post doesn't exists", 404);
    }
    const result = await CommentModel.find({postId});
    return result;
}

export const createAComment = async ({userId, content, postId}) => {
    const post = await PostModel.findOne({_id: postId});
    if(!post){
        throw new AppError("Post doesn't exist", 404);

    }
    if(!content){
        throw new AppError("Content must not be Empty", 400);
    }
    const newComment = new CommentModel({userId, content, postId});
    await newComment.save();
    return newComment;

}

export const deleteCommentOfUser = async ({commentId, userId}) => {
    const comment = await CommentModel.findById(commentId);
    if(!comment){
        throw new AppError("Comment doesn't exist", 404);
    }

    if(comment.userId.toString() != userId){
        throw new AppError("You are not allowed to delete this comment!", 403);
    }
    await comment.deleteOne();
    

}
