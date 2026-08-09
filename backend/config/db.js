import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");

        mongoose.set("debug", true);

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error);
        process.exit(1);
    }
};

export default connectDB;