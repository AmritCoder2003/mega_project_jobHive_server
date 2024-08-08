import {catchAsyncError} from "../middleware/catchAsyncError.js";
import Application from "../model/applicationModel.js";
import ErrorHandler from "../middleware/error.js";
import  cloudinary from "cloudinary"; 
import {validationResult} from "express-validator"
import Job from "../model/jobModel.js";

export const employerGetAllApplications=catchAsyncError(async(req,res,next)=>{
    const { role } = req.user.role;
    if (role === "jobseeker") {
        return next(new ErrorHandler(401, "Job Seeker is not allowed to access this resource"));
    }
    const {_id}=req.user;
    const applications=await Application.find({'employerId.user':_id});
    return res.status(200).json({applications:applications.map(application=>application.toObject({getters:true}))});
})
export const jobseekerGetAllApplications=catchAsyncError(async(req,res,next)=>{
    const { role } = req.user.role;
    if (role === "employer") {
        return next(new ErrorHandler(401, "Employer is not allowed to access this resource"));
    }
    const {_id}=req.user;
    const applications=await Application.find({'applicantId.user':_id});
    return res.status(200).json({applications:applications.map(application=>application.toObject({getters:true}))});
})

export const jobSeekerDeleteApplication=catchAsyncError(async(req,res,next)=>{
    const { role } = req.user.role;
    if (role === "employer") {
        return next(new ErrorHandler(401, "Employer is not allowed to access this resource"));
    }
    const {id}=req.params;
    const application=await Application.findByIdAndDelete(id);
    if(!application){
        return next(new ErrorHandler(404,"Application not found"));
    }
    return res.status(200).json({message:"Application deleted successfully"});
})

export const postApplication=catchAsyncError(async(req,res,next)=>{
    const { role } = req.user.role;
    if (role === "employer") {
        return next(new ErrorHandler(401, "Employer is not allowed to access this resource"));
    }
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const errorMessages = errors.array().map(err => err.msg);
        return next(new ErrorHandler(422, errorMessages));
    }
    // console.log(req.body);
    // console.log(req.files);
    if(!req.files) {
  
        return next(new ErrorHandler(422, "Please upload your resume"));
    }
   
    const {resume} = req.files;
   const allowedFormats=['image/png','image/jpg','image/jpeg','image/webp'];
   if(!allowedFormats.includes(resume.mimetype)){
    return next(new ErrorHandler(400, "Please upload a valid file format. Please use .png, .jpg, .jpeg, .webp"));
  }
  const cloudinaryResponse = await cloudinary.v2.uploader.upload(resume.tempFilePath);
  // console.log(cloudinaryResponse);
  if(!cloudinaryResponse){
    console.error("Cloudinary error:", cloudinaryResponse.errors || "Unknown error" );
    return next(new ErrorHandler(500, "Failed to upload resume"));
  }
  const {name,email,phone,coverLetter,jobId}=req.body;
  const applicantId={
    user:req.user._id,
    role:"jobseeker"
  }
  if(!jobId){
    return next(new ErrorHandler(400, "Job not found"));
  }

  let jobDetails;
  try{
    
    jobDetails=await Job.findById(jobId);
    // console.log(jobDetails);
    if(!jobDetails){
      return next(new ErrorHandler(404,"Job not found"));
    }
  }catch(err){
    return next(new ErrorHandler(500,"Something went wrong",err.message));
  }

  const employerId={
    user:jobDetails.postedBy,
    role:"employer"
  }

  const application=new Application({
    name,
    email,
    phone,
    coverLetter,
    applicantId,
    employerId,
    resume:{
      public_id:cloudinaryResponse.public_id,
      url:cloudinaryResponse.secure_url
    }
  });

  try{
    await application.save();
    return res.status(200).json({success:true,message:"Application submitted successfully"});
  }catch(err){
    return next(new ErrorHandler(500,"Something went wrong",err.message));
  }

  



})