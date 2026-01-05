import { LikeModel } from "../models/Likes.js";
import { PostModel } from "../models/Posts.js"
import { AppError } from "../utils/appError.js";

export const likeByUser = async ({ postId, userId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Fetch post inside transaction
    const post = await PostModel.findById(postId).session(session);
    if (!post) {
      throw new AppError("Post doesn't exist", 404);
    }

    // 2️⃣ Check duplicate like INSIDE transaction
    const existingLike = await LikeModel.findOne(
      { postId, userId },
      null,
      { session }
    );

    if (existingLike) {
      throw new AppError("You can't like twice", 409);
    }

    // 3️⃣ Create like
    await LikeModel.create(
      [{ postId, userId }],
      { session }
    );

    // 4️⃣ Increment counter atomically
    await PostModel.updateOne(
      { _id: postId },
      { $inc: { likesCount: 1 } },
      { session }
    );

    // 5️⃣ Commit
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    // 6️⃣ Rollback EVERYTHING
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
}