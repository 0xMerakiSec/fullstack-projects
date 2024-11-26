import dotenv from "dotenv";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.config.js";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";

dotenv.config({
  path: "./env",
});
const app = express();

const port = process.env.PORT;

//middleware configuration

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

//test route
app.get("/", (req, res) => {
  res.send("Backend DB and server working fine!");
});

//api end point
app.use("/api/v1/users", userRoutes);

try {
  connectDB();
  app.listen(port, () => {
    console.log(`server running sucessfully at the port ${port}`);
  });
} catch (error) {
  console.error(`Error connecting to the server :: Error :: ${error}`);
}
