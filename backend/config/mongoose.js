import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("😍 Database connected successfully");
  } catch (error) {
    console.error("😢 Database connection failed:", error);
    process.exit(1);
  }
};

export default connectToDB;
