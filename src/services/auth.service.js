import { PostModel } from "../models/Posts.js";
import { UserModel } from "../models/Users.js"
import { AppError } from "../utils/appError.js";
import { signJwt } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";

export const registerUser = async ({username, email, password}) => {
    const user = await UserModel.findOne({
    $or: [{ username }, { email }]
  });

    if(user){
        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new UserModel({username, password: hashedPassword, email});
    await newUser.save();

    const userObj = newUser.toObject();
    delete userObj.password;
    return userObj;

}

export const loginUser = async ({username, password}) => {

  const user = await UserModel.findOne({username});
  if(!user){
    throw new AppError("Username or Password Incorrect", 401);
  }

  const isTrue = await comparePassword(password, user.password);

  if(!isTrue){
    throw new AppError("Username or Password Incorrect", 401);
  }

  const token = signJwt({id: user._id, role: user.role});

  return { token, user: { id: user._id, email: user.email, role: user.role } }

}

export const getUserInfo = async ({userId}) => {
  const data = await UserModel.findOne({_id: userId});
  const info = data.toObject();
  delete info.password;
  return info;
}

