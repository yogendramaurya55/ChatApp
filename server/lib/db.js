import mongoose from "mongoose";

//Function to connect to mongoDB database
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
  } catch (error) {
    console.log(`Error while connecting to database : ${error}`);
  }
};

export default connectDB;
