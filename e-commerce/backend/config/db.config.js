import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `successfully connected to the mongodb at host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1); //exists out everything that is running.
  }
};

export default connectDB;
