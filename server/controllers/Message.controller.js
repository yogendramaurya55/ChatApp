import Message from "../models/Message.model";
import User from "../models/User.model";
import cloudinary from "../lib/cloudinary.js";
import { io, userScoketMap } from "../server.js";




//get all the users except the logged in user
const getUserForSidebar = async (req , res )=>{
    try {
        const userId = req.user._id;
        const filteredusers = await User.find({_id: {$ne: userId}}).select("-password")

        //Count number of messages not seen 
        const unseenMessages = {}
        const promises = filteredusers.map(async (user)=>{
            const message = await Message.find({senderId: user._id , reciverId: userId , seen: false})

            if(message.length > 0){
                unseenMessages[user._id] = message.length;
            }
        })
        
        await Promise.all(promises);

        res.json({
            success: true,
            users: filteredusers,
            unseenMessages
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })
    }
}


// get all messages for selected users
const getMessages = async (req , res)=>{
    try {
        const { id: selecteduserId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId , reciverId: selecteduserId},
                {senderId: selecteduserId , reciverId : myId}
            ]
        })

        await Message.updateMany({senderId: selecteduserId , reciverId: myId} , {seen: true})

        res.json({
            success: true,
            messages
        })

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })
    }
}

//api to mark messages as seen using message id
const markMessageAsSeen  = async (req , res)=>{
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate({id} , {seen: true})

        res.json({
            success: true
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            success: false, 
            message: error.message
        })
    }
}

const sendMessage = async (req , res) => {
    try {
        const {text , image} = req.body;
        const reciverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = await Message.create({
            senderId,
            reciverId,
            text,
            image: imageUrl
        })

        //Emit the new message to reciver scoket
        const reciverScoketId = userScoketMap[reciverId];
        if(reciverScoketId){
            io.to(reciverScoketId).emit("newMessage" , newMessage)
        }

        res.json({
            success: true ,
            newMessage
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })
    }
}


export 
{
    getUserForSidebar,
    getMessages,
    markMessageAsSeen,
    sendMessage
}