import { likeByUser } from "../services/likes.service.js";

export const postLike = async (req, res, next) => {
    try{
        const postId = req.params.id;
        const userId = req.user.id;
        await likeByUser({postId, userId});
        res.status(201).json({msg: "Liked"})
    }
    catch (err){
        next(err);
    }
}

export const deleteLike = async (req, res, next) => {
    try{
        const postId = req.params.id;
        const userId = req.user.id;
        await deleteLikeByUser({postId, userId});
        res.status(200).json({msg: "Unliked"});
    }
    catch(err){
        next(err);
    }
}