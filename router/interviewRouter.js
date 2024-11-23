import experss from "express";
import { check } from "express-validator";
import { getInterviewExperienceByCompany,getAllInterviewExperience,createInterviewExperience,likeExperience,dislikeExperience } from "../controllers/interviewExperienceController.js";

const router = experss.Router();

router.post('/interview-experience',[check('status','Status is required').notEmpty(),
    check('companyName','Company name is required').notEmpty(),
    check('position','Position is required').notEmpty(),
    check('location','Location is required').notEmpty(),
    check('date','Date is required').notEmpty(),
    check('experience','Experience is required').notEmpty(),

],createInterviewExperience);
router.get('/interview-experience', getAllInterviewExperience);
router.get('/interview-experience/:companyName', getInterviewExperienceByCompany);

router.patch('/interview-like/:experienceId',likeExperience);

router.patch('/interview-dislike/:experienceId',dislikeExperience);

export default router;