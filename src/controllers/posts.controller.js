import { createPost, getPostData, listAllPosts, updatePost, deletePost } from "../services/posts.service.js";


export const listPosts = async (req, res, next) => {
    try{
        const data = await listAllPosts({
  page: Number(req.query.page),
  limit: Number(req.query.limit),
  tag: req.query.tag
});
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
        const tags = req.body.tags;
        const post = await createPost({authorId, title, content, tags});
       
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

export const update = async (req, res, next) => {
    try{
        const postId = req.params.id;
        const {title, content} = req.body;
        const userId = req.user.id;
         const role = req.user.role;
        const updatedPost = await updatePost({postId, userId, title, content, role});
        return res.status(200).json(updatedPost);
    }
    
    catch(err){
        next(err);
    }
}

export const deletePostCon = async (req, res, next) => {
    try{
        const role = req.user.role;
        const postId = req.params.id;
        await deletePost({role, postId});
        return res.status(200).json({message: "Post deleted"})
    }
    catch(err){
        next(err);
    }
}