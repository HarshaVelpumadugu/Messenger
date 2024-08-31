import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

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
        //socket io functionality
        await Promise.all([conversation.save(),newMessage.save()]); // run in parallel
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