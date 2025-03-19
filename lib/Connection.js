
import mongoose from "mongoose";

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return mongoose.connection.getClient();
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable");
    }

    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("Connected to MongoDB");
    
    return mongoose.connection.getClient();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}