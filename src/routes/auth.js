import express from 'express';
import { UserModel } from '../models/Users.js';
import bcrypt from 'bcrypt'
import { login, register, userInfo } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/register", register)

router.post("/login", login)


router.get("/me/",authMiddleware, userInfo)

export {router as userRouter}