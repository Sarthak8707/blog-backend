import jwt from "jsonwebtoken"
import { AppError } from "../utils/appError.js";

export const authMiddleware = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            throw new AppError("Authentication Required", 401);
        }
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, "secret");
            req.user = {
                id: decoded.id,
                role: decoded.role
            }
            next();
        
    }
    catch(err){
        next(new AppError("Token is invalid or expired", 401));
    }
}