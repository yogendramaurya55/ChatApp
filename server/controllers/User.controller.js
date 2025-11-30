import cloudinary from "../lib/cloudinary.js";
import generateToken from "../lib/utils.js";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";


//signup function
const signup = async (req , res)=>{
    const {fullName , email , password , bio} = req.body;

    try {
        if(!fullName ||  !email || !password || !bio){
            return res.json(
                {
                    success: false,
                    message: "Missing Details"
                }
            )
        }
        const user = await User.findOne({email});
        if(user){
            return res.json({
                success: false,
                message: "Account already exist"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        const newUser = await User.create(
            {
                fullName,
                email,
                password: hashedPassword,
                bio
            }
        );

        const token = generateToken(newUser._id)

        return res.json({
            success: true,
            userData: newUser,
            token,
            message: "Account created Successfully"
        })
    } catch (error) {
        console.log(error.message)
        return res.json({
            success:false,
            message: error.message
        })
    }
}

//login function
const login = async (req , res)=>{
    try {
        const {email , password} = req.body;

        if(!email || !password) {
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.json({
                success: false,
                message: "Account do not exist"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password , user.password)

        if(!isPasswordCorrect){
            return res.json({
                success: false,
                message: "Wrong credentials"
            })
        }

        const token = generateToken(user._id);

        const {hashedPassword , ...userData } = user.toObject();

        return res.json({
            success: true,
            userData: userData,
            token,
            message: "Logged in succesfully"
        })

    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}


//controlle to check if user is authenticated or not
const checkAuth = (req , res)=>{
    res.json({
        success : true,
        user: req.user
    })
}

//Controller to update user profile details
const updateProfile = async (req , res)=>{
    try {
        const {profilePic , bio , fullName} = req.body;

        const userId = req.user._id;

        let updateUser;

        if(!profilePic){
            
            updateUser = await User.findByIdAndUpdate(userId , {bio , fullName} , {new: true});
        }else{
            const upload = await cloudinary.uploader.upload(profilePic);

            updateUser = await User.findByIdAndUpdate(userId , {profilePic: upload.secure_url , bio , fullName} , {new: true});
        }

        res.json({
            success: true,
            user: updateUser,
            message: "Successfully updated"
        })
    } catch (error) {

        console.log("updation failed !!!")
        
        res.json({
            success: false,
            message: error.message
        })
    }
}


export 
{
    signup,
    login,
    checkAuth,
    updateProfile
}