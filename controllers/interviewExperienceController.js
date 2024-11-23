import interviewExperienceSchema from "../model/interviewExperienceSchema.js";
import {catchAsyncError} from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

import {validationResult} from "express-validator"

export const createInterviewExperience = catchAsyncError(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return next(new ErrorHandler(422, errorMessages));
    }
    try{
        const {companyName,status, position, location, date, experience} = req.body;
        const interviewExperience = new interviewExperienceSchema({
            companyName,
            status,
            position,
            location,
            date,
            experience,
           
        });
        await interviewExperience.save();
        res.status(200).json({
            success: true,
            interviewExperience
        })
    }catch(err){
        return next(new ErrorHandler(500, "Something went wrong while saving the experience.",err.message));
    }

})

export const getAllInterviewExperience = catchAsyncError(async (req, res, next) => {
    try{
        const experiences = await interviewExperienceSchema.find();
        return res.status(200).json({experiences:experiences.map(experience=>experience.toObject({getters:true}))});
    }catch(err){
        return next(new ErrorHandler(500, "Something went wrong while fetching the experiences",err.message));
    }
})


export const getInterviewExperienceByCompany = catchAsyncError(async (req, res, next) => {
    try{
        const {companyName}= req.params;
        const experiences = await interviewExperienceSchema.find({companyName});
        
        if(!experiences || experiences.length === 0){
            return next(new ErrorHandler(404, "Interview experience not found."));
        }
        return res.status(200).json({experiences:experiences.map(experience=>experience.toObject({getters:true}))});
    }catch(err){
        return next(new ErrorHandler(500, "Something went wrong while fetching the experience.",err.message));
    }
})


export const likeExperience = catchAsyncError(async (req, res, next) => {
    try{
        const {experienceId}=req.params;
        const experience = await interviewExperienceSchema.findById(experienceId);
        if(!experience){
            return next(new ErrorHandler(404, "Interview experience not found."));
        }
        experience.likes+=1;
        await experience.save();
        return res.status(200).json({experience:experience.toObject({getters:true})});
    }catch(err){
        return next(new ErrorHandler(500, "Something went wrong while fetching the experience.",err.message));
    }
})

export const dislikeExperience = catchAsyncError(async (req, res, next) => {
    try{
        const {experienceId}=req.params;
        const experience = await interviewExperienceSchema.findById(experienceId);
        if(!experience){
            return next(new ErrorHandler(404, "Interview experience not found."));
        }
        experience.dislikes+=1;
        await experience.save();
        return res.status(200).json({experience:experience.toObject({getters:true})});
    }catch(err){    
        return next(new ErrorHandler(500, "Something went wrong while fetching the experience.",err.message));
    }
})