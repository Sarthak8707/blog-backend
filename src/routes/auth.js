import express from 'express';
import { UserModel } from '../models/Users.js';
import bcrypt from 'bcrypt'
import { register } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register", register)

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = await UserModel.findOne({username});
    if(!user){
        return res.json({msg: "Username doesn't exist"});
    }

    const isTrue = await bcrypt.compare(password, user.password);
    
    if(!isTrue){
        return res.json({msg: "Username or Password is incorrect!"});
    }

    const token = jwt.sign({id: user._id}, "secret");
    return res.json({token, userID: user._id});



})


router.get("/me/:id", async (req, res) => {
    const user = await UserModel.find({_id: id});
    if(!user){
        return res.json({msg: "user doesn't exist!"})
    }
    return res.json({msg: "will insert user data later"})

})

export {router as userRouter}