import { listAllPosts } from "../services/posts.service.js";


export const listPosts = async (req, res, next) => {
    try{
        const data = await listAllPosts();
        res.status(200).json(data)
    }
    catch(err){
        next(err);
    }
}

export const create = async (req, res) => {
    try{
        const post = await createPost(req.body);
        res.status(201).json(post);
    }
    catch(err){
        next(err);
    }
}