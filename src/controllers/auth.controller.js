import { getUserInfo, loginUser, registerUser } from "../services/auth.service.js";

export const register = async (req, res, next) => {
    //controller should only pass request data
    //const {username, password, email} = req.body;
    try{
        const user = await registerUser(req.body);
        res.status(201).json(user);
    }
    catch(err){
        next(err);
    }

}

export const login = async (req, res, next) => {
    
    try{
        const {username, password} = req.body;
        const result = await loginUser({username, password});
        const token = result.token;
        const user = result.user;
        return res.status(200).json({token, user});
    }
    catch(err){
        next(err);
    }
}

export const userInfo = async (req,res, next) => {
    try{
        const userId = req.user.id;
        const result = await getUserInfo({userId});
        return res.status(200).json(result);
    }
    catch(err){
        next(err);
    }
}