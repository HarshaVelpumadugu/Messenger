import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId,io } from "../socket/socket.js";


export const sendMessage = async(req,res)=>{
    try{
        const{message}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;
        let conversation = await Conversation.findOne({
            participants:{ $all:[senderId,receiverId]},
        })
        if(!conversation){
            conversation =await Conversation.create({
                participants:[senderId,receiverId],
            })
        }
        const newMessage=new Message({
            senderId,
            receiverId,
            message,
        })
        if(newMessage){
            conversation.messages.push(newMessage._id);
        }
        
        await Promise.all([conversation.save(),newMessage.save()]); // run in parallel
        

        //socket io functionality
        const receiverSocketId= getReceiverSocketId(receiverId);
        if(receiverSocketId){
            //io.to({socketId}).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        return res.status(201).json(newMessage);
    }
    catch(err){
        res.status(500).json({error:"Internal Server Error"});
        console.log("Error in sendMessage controller:",err.message);
    }
};
export const getMessages=async(req,res)=>{
    try{
        const{id:userToChatId}=req.params;
        const senderId=req.user._id;
        const conversation=await Conversation.findOne({
            participants:{$all:[senderId,userToChatId]},
        }).populate("messages");
        if(!conversation){
            return res.status(200).json([]);
        }
        const messages=conversation.messages;
        return res.status(200).json(messages);
    }
    catch(err){
        res.status(500).json({error:"Internal Server Error"});
        console.log("Error in getMessages controller:",err.message);
    }
}