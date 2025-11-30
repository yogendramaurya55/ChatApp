import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/User.controller";
import protectRoute from "../middleware/auth";


const userRouter = express.Router();

userRouter.post("/signup" , signup);
userRouter.post("/loin",login);
userRouter.put("update-profile", protectRoute , updateProfile);
userRouter.get("/check", protectRoute , checkAuth);

export default userRouter;
