import express from "express";
import { check } from "express-validator";
import { sendMessage,getMessage,getUserForSidebar,addConversation } from "../controllers/messageController.js";
import {isAuthorized} from "../middleware/check-auth.js"
const router = express.Router();

router.post(
    "/send/:id",
    [
        check("message", "Message is required").notEmpty(),
    ],
    isAuthorized,
    sendMessage
);

router.get("/:id",isAuthorized, getMessage);

router.get("/",isAuthorized, getUserForSidebar);

router.post("/add-conversation",isAuthorized, addConversation);

export default router;