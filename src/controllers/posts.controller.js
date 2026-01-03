import { createPost, getPostData, listAllPosts } from "../services/posts.service.js";


export const listPosts = async (req, res, next) => {
    try{
        const data = await listAllPosts();
        res.status(200).json(data)
    }
    catch(err){
        next(err);
    }
}

export const create = async (req, res, next) => {
    try{

        const authorId = req.user.id;

        const title = req.body.title;
        const content = req.body.content;
        const post = await createPost({authorId, title, content});
        res.status(201).json(post);
    }
    catch(err){
        next(err);
    }
}

export const getPost = async (req, res, next) => {
    try{
        const id = req.params.id;
        const data = await getPostData(id);
        return res.status(200).json(data);
    }
    catch(err){
        next(err);
    }
}