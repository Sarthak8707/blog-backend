import { getCommentsOfPost } from "../services/comments.service.js";

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

}

export const deleteComment = async (req, res, next) => {
    
}