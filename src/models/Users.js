import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    role: {type: String, required: true, enum: ["user", "author", "admin"]},
    createdAt: {type: Date},
    updatedAt: {type: Date}
})

export const UserModel = mongoose.model("users", UserSchema);