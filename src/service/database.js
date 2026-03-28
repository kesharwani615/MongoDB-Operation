import mongoose from "mongoose";

export const ConnectDatabase = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/practice');
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
    }
};