import { registerUser } from "../services/auth.service.js";

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
    //
}