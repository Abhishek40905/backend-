import mongoose from "mongoose";

const connectDB = async()=>{
    try {
       const connectioninstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
       console.log(`\n MongoDB connected !! DB HOST :${connectioninstance.connection.host}`);
    } catch (error) {
        console.log("Database connection failed ", error);
        process.exit(1)
    }
}
export default connectDB
/*
the above function is used to to connect mongodb and exported and it is imported in index.js
*/