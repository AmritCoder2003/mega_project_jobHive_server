
import { validationResult } from "express-validator";
import Job from "../model/jobModel.js";
import {catchAsyncError} from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import User from "../model/userModel.js";
export const getAllJobs =catchAsyncError (async (req, res,next) => {

   let jobs;
   try{
    jobs=await Job.find({expired:false});
   }catch(err){
    return next(new ErrorHandler(500,"Something went wrong",err.message));
   }
   return res.status(200).json({jobs:jobs.map(job=>job.toObject({getters:true}))});
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

export const getAllJobsByEmployer = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.body.userId);
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }
  const { role } = user.role;
  if (role === "employer") {
    return next(new ErrorHandler(401, "Employer can't fetch jobs"));
  }
  try {
    const jobs = await Job.find({ postedBy: req.body.userId});
    return res.json({ jobs: jobs.map(job => job.toObject({ getters: true })) });
  } catch (err) {
    return next(new ErrorHandler(500, "Something went wrong", err.message));
  }
});

export const createJob =catchAsyncError (async (req, res, next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new ErrorHandler(422, errorMessages));
  }
  console.log(req.body.userId);
  const user=await User.findById(req.body.userId);
  // console.log(user);
  if(!user){
    return next(new ErrorHandler(404,"User not found"));
  }
  // Check user role
  const { role } = user.role;
  if (role === "jobseeker") {
    return next(new ErrorHandler(401, "Job Seeker can't create job"));
  }

  // Extract job details from request body
  const { title, description, company, category, country, city, location, salaryFrom, salaryTo ,salaryPeriod,type,workstation} = req.body;
  console.log('Request Body:', req.body);

  const postedBy = req.body.userId; // Ensure this is coming from authenticated user

  const job = new Job({
    title,
    description,
    company,
    category,
    country,
    city,
    location,
    salaryFrom,
    salaryTo,
    postedBy,
    salaryPeriod,
    type,
    workstation
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
})
export const getJob = catchAsyncError(async (req, res,next) => {
  const { id } = req.params;
  console.log(id);
  let job;
  try{
    job=await Job.findById(id);
    if(!job){
      return next(new ErrorHandler(404,"Job not found"));
    }
    return res.status(200).json({job:job});
  }
  catch(err){
    return next(new ErrorHandler(500,"Something went wrong",err.message));
  }
})

export const updateJob =catchAsyncError(async (req, res,next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new ErrorHandler(422, errorMessages));
  }
  const user=await User.findById(req.body.userId);
  // console.log(user);
  if(!user){
    return next(new ErrorHandler(404,"User not found"));
  }
  // Check user role
  const { role } = user.role;
  if (role === "jobseeker") {
    return next(new ErrorHandler(401, "Job Seeker can't create job"));
  }

  const {id}=req.params;
  const job=await Job.findById(id);
  if(!job){
    return next(new ErrorHandler(404,"Job not found"));
  }

  const updatedJob = await Job.findByIdAndUpdate(
    id,
    {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      country: req.body.country,
      city: req.body.city,
      location: req.body.location,
      salaryFrom: req.body.salaryFrom,
      salaryTo: req.body.salaryTo,
      salaryPeriod: req.body.salaryPeriod,
      expired: req.body.expired,
      type: req.body.type,
      workstation: req.body.workstation
    },
    { new: true, runValidators: true } // Return the updated document and apply validation
  );

  return res.status(200).json({message:"Job updated successfully",data:updatedJob});
});

export const deleteJob = catchAsyncError(async (req, res,next) => {
  const user=await User.findById(req.body.userId);
  // console.log(user);
  if(!user){
    return next(new ErrorHandler(404,"User not found"));
  }
  // Check user role
  const { role } = user.role;
  if (role === "jobseeker") {
    return next(new ErrorHandler(401, "Job Seeker can't create job"));
  }

  const { id } = req.params;
  let job;
  try{
    job=await Job.findById(id);
    if(!job){
      return next(new ErrorHandler(404,"Job not found"));
    }
    await Job.findByIdAndDelete(id);
    return res.status(200).json({message:"Job deleted successfully"});
  }catch(err){
    return next(new ErrorHandler(500,"Something went wrong",err.message));
  }
});

