import { UserModel } from "../models/Users.js"
import { hashPassword } from "../utils/password.js";

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