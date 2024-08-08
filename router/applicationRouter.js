import express from "express";
import { check } from "express-validator";
import { employerGetAllApplications ,jobseekerGetAllApplications , jobSeekerDeleteApplication,postApplication } from "../controllers/applicationController.js";
import {isAuthorized} from "../middleware/check-auth.js"
const router=express.Router();

router.get('/employer',isAuthorized, employerGetAllApplications);
router.get('/jobseeker',isAuthorized, jobseekerGetAllApplications);
router.post('/post',[check('name','Name is required').notEmpty(),
    check('email','Please enter a valid email').isEmail().notEmpty(),
    check('phone','Phone number is required').notEmpty(),
    check('coverLetter','Cover letter is required').notEmpty(),

],isAuthorized, postApplication);
router.delete('/delete/:id',isAuthorized, jobSeekerDeleteApplication);


export default router;