import express from "express";
import { check } from "express-validator";
import { createorUpdateProfile,getCurrentProfile } from "../controllers/profileController.js";

import {isAuthorized} from "../middleware/check-auth.js"

const router = express.Router();


router.post("/",isAuthorized,createorUpdateProfile);
router.get("/",isAuthorized,getCurrentProfile);
export default router;
