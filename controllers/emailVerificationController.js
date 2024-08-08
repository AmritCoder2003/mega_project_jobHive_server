import EmailVerification from "../config/emailVerification.js";
import { validationResult } from "express-validator";
import otpModel from "../model/otpModel.js";

export const emailVerification = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    const { email, name } = req.body;

    // Check if a valid OTP already exists for this email
    const existingOtp = await otpModel.findOne({ email });
    if (existingOtp) {
        return res.status(422).json({ message: "An OTP request already exists for this email. Please wait until it expires." });
    }

    // Generate a 6-digit OTP
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

    // Send email with the OTP
    const emailVerification = await EmailVerification(email, otp, name);
    // console.log(emailVerification);

    // Save OTP to the database with expiration
    const newOtp = new otpModel({
        email: email,
        otp: otp,
    });

    try {
        await newOtp.save();
        return res.status(200).json({ message: "Email sent successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

export const verifyOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    const { email, otp } = req.body;

    const checkOtp = await otpModel.findOne({ email, otp });

    if (!checkOtp) {
        return res.status(422).json({ message: "Invalid or expired OTP" });
    }

    // OTP is valid, delete it from the database
    await otpModel.deleteOne({ _id: checkOtp._id });

    return res.status(200).json({ message: "OTP verified successfully" });
};
