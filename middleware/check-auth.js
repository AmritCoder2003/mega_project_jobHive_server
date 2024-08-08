import {catchAsyncError} from './catchAsyncError.js'
import jwt from 'jsonwebtoken'
import User from '../model/userModel.js'
import ErrorHandler from '../middleware/error.js'
import dotenv from 'dotenv'
dotenv.config()

export const isAuthorized = catchAsyncError(async (req,res,next)=>{
  let {token} = req.cookies;
  if(!token){
    return next(new ErrorHandler(401,"Not Authorized!"))
  }
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
})