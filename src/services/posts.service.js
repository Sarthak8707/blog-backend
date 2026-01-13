import { redis } from "../index.js";
import { CommentModel } from "../models/Comments.js";
import { LikeModel } from "../models/Likes.js";
import { PostModel } from "../models/Posts.js"
import { AppError } from "../utils/appError.js";


const getFromDBandCache = async ({page, limit, tag, lockKey}) => {

    
  if (!page) page = 1;
  if (!limit) limit = 10;

  const skip = (page - 1) * limit;

  const filter = {};

 
  if (tag!==undefined) {
    filter.tags = tag;
    const posts = await PostModel.find(filter)
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit);

    //set cache
    try{
        
        await redis.incr(`${cacheKey}:views`);
        await redis.expire(`${cacheKey}:views`, 300);
        const views = await redis.get(`${cacheKey}:views`);
        // partial caching
        if(views >= 10) await redis.set(cacheKey, JSON.stringify(posts), {EX: 30});
        // release lock
        if(lockKey) await redis.del(lockKey);
    }
    catch(err){
        console.log("Redis error:", err);
    }
  return posts;
  }

  const posts = await PostModel.find()
    .skip(skip)
    .limit(limit);

    // set cache
    try{
        await redis.set(cacheKey, JSON.stringify(posts), {EX: 30});
        // release lock
        if(lockKey) await redis.del(lockKey)
    }
    catch(err){
        console.log("Redis error:", err);
    }
  return posts;
}


export const listAllPosts = async ({ page, limit, tag }) => {

    // check for cache 
    const cacheKey = `posts:${page}:${limit}:${tag}`;
    
    try{
        const cachedValue = await redis.get(cacheKey);
    if(cachedValue) {
       return JSON.parse(cachedValue)
    };
    }
    catch(err){
        console.log("Redis error:", err);
    }

    const lockKey = `lockKey:${cacheKey}`;
    const lock = await redis.set(lockKey, "1", {NX: true, EX: 10});

    // cache stampede prevention

    if(lock){
        // return from db and cache
       return getFromDBandCache({page, limit, tag, lockKey});
    }
    // wait for cache
    await newPromise (r => setTimeout(r, 100));

    // retry 
    try{
        const cachedValue = await redis.get(cacheKey);
    if(cachedValue) {
       return JSON.parse(cachedValue)
    };
    }
    catch(err){
        console.log("Redis error:", err);
    }

    // if still not got data then return from db

    return getFromDBandCache({page, limit, tag});


};


export const createPost = async ({authorId, title, content, tags}) => {
    if(!title || !content){
        throw new AppError("Title and Post are required", 400);
    }
    const newPost = new PostModel({authorId, title, content});
    await newPost.save();

    // invalidate cache

    for(const tag in tags){
        const keys = await redis.keys(`posts:*:*:${tag}`);
        if(keys.length){
            await redis.del(keys)
        }
    }

}

export const getPostData = async (id) => {
    const cacheKey = `post:${id}`;
    const cached = await redis.get(cacheKey);

    // check for cache
    if(cached) return JSON.parse(cached);
    
    const data = await PostModel.findOne({_id: id});

    // update cache
    try{
        await redis.set(cacheKey, JSON.stringify(data), {EX: 30});
    }
    catch(err){
        console.log("Redis error:", err)
    }
    return data;
}


export const updatePost = async({userId, postId, title, content, role}) => {
    const post = await PostModel.findById(postId);
    if(!post){
        throw new AppError("Post not found", 404);
    }

   // console.log(post.authorId)
    if(post.authorId.toString() != userId && role != "admin"){
        throw new AppError("You are not allowed to update this post", 403);
    }
    if(title !== undefined) post.title = title;
    if(content !== undefined) post.content = content;
    
    await post.save();

    // invalidate cache
    try{
        await redis.del(`posts:${postId}`);
    }
    catch(err){
        console.log("Redis error:", err);
    }

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

    await LikeModel.deleteMany({postId});
    await CommentModel.deleteMany({postId});


    await post.deleteOne();
    // invalidate cache

    try{
        const keys = await redis.keys(`post:${postId}`);
    await redis.del(keys);
    }
    catch(err){
        console.log("Redis error:", err);
    }
    return post;

}