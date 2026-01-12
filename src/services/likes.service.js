import { redis } from "../index.js";
import { LikeModel } from "../models/Likes.js";
import { PostModel } from "../models/Posts.js"
import { AppError } from "../utils/appError.js";

export const likeByUser = async ({ postId, userId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //  Fetch post inside transaction
    const post = await PostModel.findById(postId).session(session);
    if (!post) {
      throw new AppError("Post doesn't exist", 404);
    }

    //  Check duplicate like INSIDE transaction
    const existingLike = await LikeModel.findOne(
      { postId, userId },
      null,
      { session }
    );

    if (existingLike) {
      throw new AppError("You can't like twice", 409);
    }

    //  Create like
    await LikeModel.create(
      [{ postId, userId }],
      { session }
    );

    //  Increment counter atomically
    await PostModel.updateOne(
      { _id: postId },
      { $inc: { likesCount: 1 } },
      { session }
    );

    //  Commit
    await session.commitTransaction();
    session.endSession();

    // Update cache
    let likes = 0;
    const cachedData = await redis.get(`likes:${postId}`);
    if(cachedData) likes = cachedData
    likes++;
    await redis.set(`likes:${postId}`, likes, {EX: 60});

  } catch (err) {
    //  Rollback 
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const deleteLikeByUser = async ({postId, userId}) => {
    const post = await PostModel.findOne({_id: postId});
    if(!post){
        throw new AppError("Post doesn't exist", 404);
    }
    const like = await LikeModel.findOne({userId, postId});
    if(!like){
        throw new AppError("you cant unlike twice", 409);
    }
    await like.deleteOne();

    // update cache
    let likes = await redis.get(`likes:${postId}`);
    likes--;
    await redis.set(`likes:${postId}`, likes, {EX: 60})

}