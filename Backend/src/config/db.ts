import mongoose from "mongoose";

async function ConnectDB() {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI!); 
        console.log(`MongoDB connected: ${connect.connection.host}`);        
    } catch (error) {
        console.log(`Error in connecting DB ${error}`);
    }
}
export default ConnectDB;