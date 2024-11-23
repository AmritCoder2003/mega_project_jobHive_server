import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import session from "express-session";

import passport from "passport";
// import "./strategies/jwt-strategy.js"; // Ensure this file exists and is correctly configured
// import "./strategies/google-auth-register.js"; // Ensure the correct path

import morgan from "morgan";
import jobRouter from "./router/jobRouter.js";
import userRouter from "./router/userRouter.js";
import contactRouter from "./router/contactRouter.js";
import applicationRouter from "./router/applicationRouter.js";
import emailRouter from "./router/emailRouter.js";
import profileRouter from "./router/profileRouter.js";
import companyReviewRouter from "./router/companyReviewRouter.js";
import interviewRouter from "./router/interviewRouter.js";
import messageRouter from "./router/messageRouter.js";

// import googleAuthRouter from "./router/googleAuthRouter.js";
// import applicationRouter from "./router/applicationRouter.js";  
import mongoose from "mongoose";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middleware/error.js";
import MongoStore from "connect-mongo";
import bodyParser from "body-parser";

// Configuration variables
const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 8050;
const NODE_ENV = process.env.NODE_ENV || "development";

// Initialize Express app
const app = express();
//import {app, server, io} from "./socket/socket.js";

// Middleware configuration
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));
app.use(express.static("public"));
app.use(bodyParser.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret", // Use a secret from environment variables
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 },
    store: MongoStore.create({ mongoUrl: MONGODB_URL }),
  })
);

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Routes
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/email", emailRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/reviews", companyReviewRouter);
app.use("/api/v1/interviews", interviewRouter);
app.use("/api/v1/messages", messageRouter);

// app.use("/emp/auth", googleAuthRouter);


app.use(fileUpload());



// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Database connection
dbConnection();

// Error handling middleware
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
