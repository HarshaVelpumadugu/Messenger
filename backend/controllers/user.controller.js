import User from "../models/user.model.js";
export const getUsersForSidebar=async(req,res)=>{
    try{
        const loggedInUserId=req.user._id;
        const filteredUsers=await User.find({_id:{ $ne: loggedInUserId}}).select("-password");
        return res.status(200).json(filteredUsers);
    }
    catch(err){
        res.status(500).json({error:"Internal Server Error"});
        console.log("Error in getMessages controller:",err.message);
    }
}