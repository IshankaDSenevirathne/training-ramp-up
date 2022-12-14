import express,{Router} from "express";
import { registerUser, loginUser, logoutUser, loginStatus } from '../controllers'
import { UserAuthGuard , ValidateInputsGuard} from "../middleware";
import { signupInputDataValidator, loginInputDataValidator } from "../interfaces";

export const userRouter:Router=express.Router();


//Sign Up User
userRouter.post("/register",ValidateInputsGuard(signupInputDataValidator),registerUser);

//Sign In User
userRouter.post("/login",ValidateInputsGuard(loginInputDataValidator),loginUser);

//Check user status
userRouter.get("/status",UserAuthGuard,loginStatus);

//Log out user
userRouter.delete("/logout/:sessionId",UserAuthGuard,logoutUser);

