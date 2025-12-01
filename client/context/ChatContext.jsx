import { Children, createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";



const  ChatContext = createContext();

const ChatProvider = ({children})=>{

    const [messages , setMessages] = useState([]);
    const [users , setUsers] = useState([]);
    const [selectedUser , setSelectedUser] = useState(null);
    const [unseenMessages , setUnseenMessages] = useState({});

    const {socket , axios} = useContext(AuthContext);


    //function to get all users for sidebar
    const getUsers = async ()=>{
        try {
            const {data} =  await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to get messages for seleted user 
    const getMessages = async (userId)=>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`)
            if(data.success){
                console.log("fetched messages");
                setMessages(data.messages)
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Something went wrong";
            toast.error("Error occured while fetching the message: " + msg);
        }
    }

    // function to send message to seleted user 
    const sendMessage = async (messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}` , messageData);
            if(data.success){
                setMessages((prevMessages)=>[
                    ...prevMessages,
                    data.newMessage
                ])
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //fnction to subscribe to messages for selected user 
    const subscribeToMessage = async ()=>{
        if(!socket) return ;

        socket.on("newMessage" , (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=>[
                    ...prevMessages,
                    newMessage
                ])
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=> ({
                    ...prevUnseenMessages,
                    [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] +1 : 1
                }))
            }
        })
    }

    //function to unsubscribe from messages
    const unsubscribefromMessages = ()=>{
        if(socket) socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeToMessage();
        return ()=> unsubscribefromMessages();
    },[socket , selectedUser])

    const value = {
        getUsers,
        users,
        selectedUser,
        messages,
        setMessages,
        setSelectedUser,
        getMessages,
        sendMessage,
        subscribeToMessage,
        unsubscribefromMessages,
        unseenMessages,
        setUnseenMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}


export
{
    ChatContext,
    ChatProvider
}