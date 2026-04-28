import mongoose from "mongoose";

export async function connectDB() {
  const { MONGO_URL } = process.env;

  if (!MONGO_URL) {
    throw new Error("MONGO_URL is not set. Add it to your .env file.");
  }

  await mongoose.connect(MONGO_URL);
  console.log("MongoDB connected");
}