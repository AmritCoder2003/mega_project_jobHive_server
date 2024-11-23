import express from "express";
import { check } from "express-validator";
import { employerGetAllApplications ,employergetApplications,noofapplications,updateApplication,jobseekerGetAllApplications ,jobseekerGetApplication, jobSeekerDeleteApplication,postApplication } from "../controllers/applicationController.js";
import {isAuthorized} from "../middleware/check-auth.js"
const router=express.Router();

router.get('/employer',isAuthorized, employerGetAllApplications);
router.get('/jobseeker',isAuthorized, jobseekerGetAllApplications);

router.get('/get/:id',isAuthorized, jobseekerGetApplication);

router.patch('/edit/:id',[
    check('coverLetter','Cover letter is required').notEmpty(),
],isAuthorized, updateApplication);

router.post('/post/:id',[check('name','Name is required').notEmpty(),
    check('email','Please enter a valid email').isEmail().notEmpty(),
    check('phone','Phone number is required').notEmpty(),
    check('coverLetter','Cover letter is required').notEmpty(),

],isAuthorized, postApplication);

router.get('/noofapplications',isAuthorized, noofapplications);

router.delete('/delete/:id',isAuthorized, jobSeekerDeleteApplication);

router.get('/allapplications/:id',isAuthorized, employergetApplications);

export default router;