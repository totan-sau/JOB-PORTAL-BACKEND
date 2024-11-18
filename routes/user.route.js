import express from 'express';
import { login, logout, register, updateProfile } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload } from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.route("/register").post(singleUpload, register);
userRouter.route("/login").post(login);
userRouter.route("/logout").post(logout);
userRouter.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

export default userRouter;

