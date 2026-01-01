import express from 'express';
import { UserModel } from '../models/Users.js';
import bcrypt from 'bcrypt'
import { login, register } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register", register)

router.post("/login", login)


router.get("/me/:id", async (req, res) => {
    const user = await UserModel.find({_id: id});
    if(!user){
        return res.json({msg: "user doesn't exist!"})
    }
    return res.json({msg: "will insert user data later"})

})

export {router as userRouter}