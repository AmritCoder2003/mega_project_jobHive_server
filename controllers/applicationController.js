import {catchAsyncError} from "../middleware/catchAsyncError.js";
import Application from "../model/applicationModel.js";
import ErrorHandler from "../middleware/error.js";
import  cloudinary from "cloudinary"; 
import {validationResult} from "express-validator"
import Job from "../model/jobModel.js";
import User from "../model/userModel.js";

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
  const user = await User.findById(req.body.userId);
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }
  const { role } = user.role;
  if (role === "employer") {
    return next(new ErrorHandler(401, "Employer can't fetch applications"));
  }
  try{
    const applications=await Application.find({'applicantId.user':req.body.userId}).populate('jobId','title company  category date type workstation ').exec();
   
    return res.status(200).json({applications:applications.map(application=>({
      jobTitle:application.jobId.title,
      company:application.jobId.company,
      category:application.jobId.category,
      date:application.date,
      type:application.jobId.type,
      workstation:application.jobId.workstation,
      applicationId:application._id
    }) )});
  }catch(err){
    return next(new ErrorHandler(500,"Something went wrong",err.message));
  }
})

export const jobseekerGetApplication=catchAsyncError(async(req,res,next)=>{
  const user =await User.findById(req.body.userId);
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }
  const { role } = user.role;
  if (role === "employer") {
    return next(new ErrorHandler(401, "Employer can't fetch applications"));
  }
  const {id}=req.params;
  const application=await Application.findById(id);
  if(!application){
    return next(new ErrorHandler(404,"Application not found"));
  }
  return res.status(200).json({application:application.toObject({getters:true})});
})


export const updateApplication=catchAsyncError(async(req,res,next)=>{
  const user =await User.findById(req.body.userId);
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }
  const { role } = user.role;
  if (role === "employer") {
    return next(new ErrorHandler(401, "Employer can't fetch applications"));

  }

  const errors=validationResult(req);
  if(!errors.isEmpty()){
    const errorMessages=errors.array().map(err=>err.msg);
    return next(new ErrorHandler(422,errorMessages));
  }
  const {id}=req.params;
  const application=await Application.findById(id);


  if(!application){
    return next(new ErrorHandler(404,"Application not found"));
  }
  if(!req.files){
    return next(new ErrorHandler(400,"No file uploaded"));
  }

  const {resume}=req.files;
  const allowedFormats=['image/png','image/jpg','image/jpeg','image/webp'];

  if(!allowedFormats.includes(resume.mimetype)){
    return next(new ErrorHandler(400,"Invalid file format"));
  }
  const cloudinaryResponse=await cloudinary.v2.uploader.upload(resume.tempFilePath);
  if(!cloudinaryResponse){
    console.error("Cloudinary error:",cloudinaryResponse.errors || "Something went wrong" );
    return next(new ErrorHandler(500,"Something went wrong"));
  }

  if(application.resume && application.resume.public_id){
    await cloudinary.v2.uploader.destroy(application.resume.public_id);
  } 

  application.resume={
    public_id:cloudinaryResponse.public_id,
    url:cloudinaryResponse.secure_url
  }
  
  application.coverLetter=req.body.coverLetter;

  const updatedApplication=await Application.findByIdAndUpdate(id,application,{
    new:true
  });
  return res.status(200).json({application:updatedApplication.toObject({getters:true})});
  
})

export const jobSeekerDeleteApplication=catchAsyncError(async(req,res,next)=>{
  const user =await User.findById(req.body.userId);
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }
  const { role } = user.role;
  if (role === "employer") {
    return next(new ErrorHandler(401, "Employer can't fetch applications"));

  }
    const {id}=req.params;
    const application=await Application.findById(id);
    if(!application){
      return next(new ErrorHandler(404,"Application not found"));
    }
    try{
      await cloudinary.v2.uploader.destroy(application.resume.public_id);
    await Application.findByIdAndDelete(id);
    }catch(err){
      return next(new ErrorHandler(500,"Something went wrong",err.message));
    }
    return res.status(200).json({message:"Application deleted successfully"});
})

export const postApplication=catchAsyncError(async(req,res,next)=>{
  const user=await User.findById(req.body.userId);
  // console.log(user);
  // console.log(req.body);
  // console.log(req.files);
  // console.log(req.params.id);


  if(!user){
    return next(new ErrorHandler(404,"User not found"));
  }
  // Check user role
  const { role } = user.role;
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
  const {name,email,phone,coverLetter}=req.body;
  const applicantId={
    user:req.body.userId,
    role:"jobseeker"
  }
  const jobId=req.params.id;
 

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
    },
    jobId

  });

  try{
    await application.save();
    return res.status(200).json({success:true,message:"Application submitted successfully"});
  }catch(err){
    return next(new ErrorHandler(500,"Something went wrong",err.message));
  }

  



})


export const noofapplications=catchAsyncError(async(req,res,next)=>{
  const user =await User.findById(req.body.userId);
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }
  const { role } = user.role;
  if (role === "jobseeker") {
    return next(new ErrorHandler(401, "Jobseeker can't fetch applications"));

  }
  try{
    const jobs = await Job.find({ postedBy: req.body.userId});
    const applications = await Application.find({ jobId: { $in: jobs.map(job => job._id) } });
    return res.status(200).json({ noofapplications: applications.length , jobs:jobs });
  }
  catch(err){
    return next(new ErrorHandler(500,"Something went wrong",err.message));
  }

})

export const employergetApplications=catchAsyncError(async(req,res,next)=>{
  const user =await User.findById(req.body.userId);
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }
  const { role } = user.role;
  if (role === "jobseeker") {
    return next(new ErrorHandler(401, "Jobseeker can't fetch applications"));

  }
  const { id } = req.params;
  try{
    const applications=await Application.find({jobId:id});
    return res.status(200).json({applications:applications.map(application=>application.toObject({getters:true}))});
  }catch(err){
    return next(new ErrorHandler(500,"Something went wrong",err.message));
  }
})