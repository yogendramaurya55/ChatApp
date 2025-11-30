import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/User.controller.js";
import protectRoute from "../middleware/auth.js";


const userRouter = express.Router();

userRouter.post("/signup" , signup);
userRouter.post("/loin",login);
userRouter.put("update-profile", protectRoute , updateProfile);
userRouter.get("/check", protectRoute , checkAuth);

export default userRouter;
