import express from "express";
import {check} from "express-validator"
import {emailVerification,verifyOtp} from "../controllers/emailVerificationController.js";
const emailRouter = express.Router();

emailRouter.post("/send", [ 
    check("email", "Please include a valid email").isEmail().notEmpty(),
    check("name", "Name is required").notEmpty(),
], emailVerification);

emailRouter.post("/verify", 
    [check("otp", "Please include a valid otp").isNumeric().notEmpty(),
    check("email", "Please include a valid email").isEmail().notEmpty(),
    ],
    verifyOtp);

export default emailRouter