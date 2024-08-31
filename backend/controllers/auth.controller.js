import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
export const signup= async(req,res)=>{
    try{
       const{fullName,username,password,confirmPassword,gender}=req.body;

       if(!fullName || !username || !password || !confirmPassword || !gender){
        return res.status(400).json({ error: "All fields are required" });
       }

       if(password !== confirmPassword){
        return res.status(404).json({error:"Password's don't match"})
       }

       const user=await User.findOne({username});

       if(user){
        return res.status(400).json({error:"Username already exists"})
       }
       const salt=await bcrypt.genSalt(10);
       const hashedPassword=await bcrypt.hash(password,salt);

       const boyProfilePic=`https://avatar.iran.liara.run/public/boy?username=${username}`
       const girlProfilePic=`https://avatar.iran.liara.run/public/girl?username=${username}`

       const newUser=new User({
         fullName,
         username,
         password,
         gender,
         profilepic:gender === "female" ? girlProfilePic : boyProfilePic
       })

       if(newUser){
        generateTokenAndSetCookie(newUser._id,res);
        await newUser.save();
        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            username:newUser.username,
            profilepic:newUser.profilepic
        });
       } 
       else {
         res.status(400).json({error:"Invalid user data"});
       }
    } catch(err){
        console.log("error in signup controller",err.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const login=async(req,res)=>{
    try{
        const{username,password}=req.body;
        const user=await User.findOne({username});
        const isPasswordCorrect=await bcrypt.compare(password,user?.password || "");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid username or password"});
        }
        generateTokenAndSetCookie(user._id,res);
        res.status(201).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            profilepic:user.profilepic
        });
    }
    catch(err){
        console.log("error in login controller",err.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};
export const logout=(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"logged out successfully"});
    }
    catch(err){
        console.log("error in logout controller",err.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};