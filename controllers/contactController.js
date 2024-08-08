import contactModel from "../model/contactModel.js";
import { validationResult } from "express-validator";
import messageSender from "../config/messageSender.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

export const createContact = catchAsyncError(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return next(new ErrorHandler(422, errorMessages));
    }
    const { name, email, message } = req.body;
    const contact = new contactModel({
        name,
        email,
        message,
    });
    try {
        await contact.save();
        const sendMessage = await messageSender(email);
        console.log(sendMessage);
        return res.status(200).json({
            success: true,
            message: "Message sent successfully"
        });
    } catch (err) {
        return next(new ErrorHandler(500, "Something went wrong"));
    }
});
