import companyReviewModel from "../model/companyReviewModel.js";

import ErrorHandler from "../middleware/error.js";

import {catchAsyncError} from "../middleware/catchAsyncError.js";
import { validationResult } from "express-validator";

export const submitReview = catchAsyncError(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return next(new ErrorHandler(422, errorMessages));
    }
  
    try {
      console.log("Request body:", req.body);  // Log the request body
      const review = await companyReviewModel.create(req.body);
      return res.status(200).json({ review: review });
    } catch (err) {
      console.error("Error creating review:", err);  // Log the error
      return next(new ErrorHandler(500, "Something went wrong while creating the review."));
    }
  });
  
export const getCompanyNames=catchAsyncError(async(req,res,next)=>{
  try{
    const companyName=await companyReviewModel.find({},"companyName");
    return res.status(200).json({companyName:companyName.map(company=>company.toObject({getters:true}))});

  }catch(err){
    return next(new ErrorHandler(500, "Something went wrong while fetching the company names."));
  }
})

export const getCompanywiseReviews=catchAsyncError(async(req,res,next)=>{
   try{
    const {companyName}=req.params;
    const reviews=await companyReviewModel.find({companyName:companyName});
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this company" });
    }
    return res.status(200).json({
      reviews: reviews.map((review) => review.toObject({ getters: true }))
    });
   }catch(err){
    return next(new ErrorHandler(500, "Something went wrong while fetching the reviews."));
   }
})