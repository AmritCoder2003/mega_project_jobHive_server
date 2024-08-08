import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL;
export const dbConnection =()=>{
   mongoose
     .connect(MONGODB_URL, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
       dbName: "jobDB",
     })
     .then(() => {
       console.log("Connected to Database");
     })
     .catch((err) => {
       console.error("Connection failed", err);
     });
}