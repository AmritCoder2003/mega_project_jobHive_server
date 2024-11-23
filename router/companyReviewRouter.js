import express from "express";
import { check } from "express-validator";
import { submitReview,getCompanyNames,getCompanywiseReviews } from "../controllers/companyReviewController.js";


const router = express.Router();

router.post("/review",[check("overallRating","Overall rating is required").notEmpty(),
    check("workLifeBalance","Work life balance is required").notEmpty(),
    check("salaryBenefits","Salary benefits is required").notEmpty(),
    check("promotions","Promotions is required").notEmpty(),
    check("jobSecurity","Job security is required").notEmpty(),
    check("skillDevelopment","Skill development is required").notEmpty(),
    check("workSatisfaction","Work satisfaction is required").notEmpty(),
    check("companyCulture","Company culture is required").notEmpty(),
    check("likes","Likes is required").notEmpty(),
    check("dislikes","Dislikes is required").notEmpty(),
    check("gender","Gender is required").notEmpty(),
    check("workPolicy","Work policy is required").notEmpty(),
    check("currentEmployee","Current employee is required").notEmpty(),
    check("employmentType","Employment type is required").notEmpty(),
    check("companyName","Company name is required").notEmpty(),
    check("designation","Designation is required").notEmpty(),
    check("department","Department is required").notEmpty()
],submitReview); 

router.get("/company",getCompanyNames);

router.get("/company/:companyName",getCompanywiseReviews);

export default router;