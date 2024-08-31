import mongoose from "mongoose";

const connectToMongoDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Database connected successfully");
    }
    catch(err){
        console.log("error connecting to database",err.message);
    }
};

export default connectToMongoDB;