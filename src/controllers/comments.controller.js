import { createAComment, deleteCommentOfUser, getCommentsOfPost } from "../services/comments.service.js";

export const getComments = async (req, res, next) => {
    try{
        const postId=req.params.id;
        const data = await getCommentsOfPost({postId})
        res.status(200).json(data);

    }
    catch(error){
        next(error);
    }
}

export const createComments = async (req, res, next) => {
    try{
        const postId = req.params.id;
        const content = req.body.content;
        const userId = req.user.id;
        const data = await createAComment({postId, content, userId});
        res.status(201).json(data);
    }
    catch(error){
        next(err);
    }

}

export const deleteComment = async (req, res, next) => {
    try{
        const commentId = req.params.id;
        const userId = req.user.id;
        await deleteCommentOfUser({userId, commentId});
        res.status(200).json({msg: "Comment Deleted!"})

    }
    catch(err){
        next(err);
    }
}