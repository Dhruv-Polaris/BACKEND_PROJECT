import mongoose from "mongoose";
import{ DB_NAME } from "../constants.js";
console.log("Connecting to DB with URI:", process.env.MONGODB_URI);
console.log("DB Name:", DB_NAME);


const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(` MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    }catch(err){
        console.error("Database connection error:", err);
        process.exit(1);
    }
}

export default connectDB;