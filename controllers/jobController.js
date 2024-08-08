
import { validationResult } from "express-validator";
import Job from "../model/jobModel.js";
import {catchAsyncError} from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
export const getAllJobs =catchAsyncError (async (req, res,next) => {

   let jobs;
   try{
    jobs=await Job.find({expired:false});
   }catch(err){
    return next(new ErrorHandler(500,"Something went wrong",err.message));
   }
   return res.json({jobs:jobs.map(job=>job.toObject({getters:true}))});
});

export const getAllJobsByUser = catchAsyncError(async (req, res,next) => {

  const { role } = req.user.role;
  if (role === "jobseeker") {
    return next(new ErrorHandler(401, "Job Seeker can't create job"));
  }

  let jobs;
  try{
    jobs=await Job.find({postedBy:req.user._id,expired:false});
  }catch(err){
    return next(new ErrorHandler(500,"Something went wrong",err.message));
  }
  return res.json({jobs:jobs.map(job=>job.toObject({getters:true}))});
});

export const createJob = async (req, res, next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new ErrorHandler(422, errorMessages));
  }

  // Check user role
  const { role } = req.user.role;
  if (role === "jobseeker") {
    return next(new ErrorHandler(401, "Job Seeker can't create job"));
  }

  // Extract job details from request body
  const { title, description, company, category, country, city, location, fixedSalary, salaryForm, salaryTo } = req.body;
  console.log('Request Body:', req.body);

  const postedBy = req.user._id; // Ensure this is coming from authenticated user

  const job = new Job({
    title,
    description,
    company,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryForm,
    salaryTo,
    postedBy
  });

  console.log('Job Object:', job);

  try {
    const savedJob = await job.save();
    console.log('Saved Job:', savedJob);
    return res.status(201).json({ message: "Job created successfully", data: savedJob });
  } catch (err) {
    console.error('Error Saving Job:', err);
    return next(new ErrorHandler(500, "Something went wrong", err.message));
  }
};
export const getJob = async (req, res) => {
  const { id } = req.params;
  let job;
  try{
    job=await Job.findById(id);
    if(!job){
      return next(new ErrorHandler(404,"Job not found"));
    }
    return res.status(200).json({data:job});
  }
  catch(err){
    return next(new ErrorHandler(500,"Something went wrong",err.message));
  }
};

export const updateJob =async (req, res,next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new ErrorHandler(422, errorMessages));
  }
  const { role } = req.user.role;
  if (role === "jobseeker") {
    return next(new ErrorHandler(401, "Job Seeker can't create job"));
  }

  const {id}=req.params;
  
  const updatedJob=await Job.findByIdAndUpdate(id,req.body,{new:true,runValidators:true});
  if(!updatedJob){
    return next(new ErrorHandler(404,"Job not found"));
  }
  return res.status(200).json({message:"Job updated successfully",data:updatedJob});
};

export const deleteJob = async (req, res) => {
  const { role } = req.user.role;
  if (role === "jobseeker") {
    return next(new ErrorHandler(401, "Job Seeker can't create job"));
  }

  const { id } = req.params;
  let job;
  try{
    job=await Job.findByIdAndDelete(id);
    if(!job){
      return res.status(404).json({message:"Job not found"});
    }
    return res.status(200).json({message:"Job deleted successfully"});
  }catch(err){
    return res.status(500).json({message:"Something went wrong",error:err.message})
  }
};
