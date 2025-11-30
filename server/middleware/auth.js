import jwt, { decode } from "jsonwebtoken"
import User from "../models/User.model";


//Middleware to protect routes 

const protectRoute = async (req , res , next)=>{
    try {
        const token = req.headers.token;

        const decoded = jwt.verify(token , process.env.JWT_SCERET);

        const user = await User.findOne(decoded.userId);

        if(!user){
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}


export default protectRoute;