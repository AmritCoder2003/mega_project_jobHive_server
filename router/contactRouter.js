import express from "express";
import { check } from "express-validator";

import { createContact } from "../controllers/contactController.js";

const router = express.Router();

router.post(
    '/',
    [
        check("name", "Name is required").notEmpty(),
        check("email", "Please include a valid email").isEmail().notEmpty(),
        check("message", "Message is required").notEmpty(),
    ],
    createContact
);

export default router;