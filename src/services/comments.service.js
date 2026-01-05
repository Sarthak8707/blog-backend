import { CommentModel } from "../models/Comments.js"

export const getCommentsOfPost = async ({postId}) => {
    const result = await CommentModel.find({postId});
    return result;
}

