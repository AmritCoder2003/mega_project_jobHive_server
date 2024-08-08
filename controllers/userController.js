import { validationResult} from "express-validator"
import User from "../model/userModel.js";
import bcrypt from "bcrypt";
const jwtSecret = process.env.JWT_SECRET;
import jwt from "jsonwebtoken";
import mailSender from "../config/mailSender.js";
import RegistrationMailOfuser from "../config/registrationmailofUser.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import dotenv from "dotenv";

dotenv.config();



export const createUser = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return next(new ErrorHandler(422, errorMessages));
  }

  const { email, name, phone, password, role, confirmPassword } = req.body;
  if (password !== confirmPassword) {
      return next(new ErrorHandler(422, "Passwords do not match!"));
  }

  let existingUser;
  try {
      existingUser = await User.findOne({ email: email });
  } catch (err) {
      return next(new ErrorHandler(500, "Something went wrong!"));
  }

  if (existingUser) {
      return next(new ErrorHandler(422, "User already exists!"));
  }

  const user = new User({
      email,
      name,
      phone,
      password,
      role,
  });

  try {
      await user.save();
      
      RegistrationMailOfuser(email);
      const token = user.getJwtToken();
      const options = {
          expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
          httpOnly: true,
      };
      
      // Remove the password field before sending the response
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return res.status(201).cookie("token", token, options).json({
          success: true,
          user: userWithoutPassword,
          token,
          message: "User created successfully"
      });
 
  } catch (err) {
      return next(new ErrorHandler(500, "Something went wrong!"));
  }
});


export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorHandler(422, "Please provide email, password, and role"));
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }).select("+password");
  } catch (err) {
    return next(new ErrorHandler(500, "Something went wrong!"));
  }

  if (!existingUser) {
    return next(new ErrorHandler(401, "Invalid credentials"));
  } else {
    const isPasswordMatch = await existingUser.comparePassword(password);
    const isRoleMatch = (existingUser.role === role);

    if (!isRoleMatch) {
      return next(new ErrorHandler(401, "User with this role does not exist"));
    }
    if (!isPasswordMatch) {
      return next(new ErrorHandler(401, "Invalid credentials"));
    } else {
      const token = existingUser.getJwtToken();
      const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      // Remove the password field before sending the response
      const userWithoutPassword = existingUser.toObject();
      delete userWithoutPassword.password;

      return res.status(200).cookie("token", token, options).json({
        success: true,
        user: userWithoutPassword,
        token,
        message: "Login successful"
      });
    }
  }
});

export const forgetPassword = async (req, res,next) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(new ErrorHandler(422,errors.array()))
    }
    const {email}=req.body;
    let existingUser;
    try{
        existingUser=await User.findOne({email:email});
    }catch(err){
        return next(new ErrorHandler(500,"Something went wrong"))
    }
    if(!existingUser){
        return next(new ErrorHandler(422,"User does not exist"))
    }
    const secret = jwtSecret + existingUser.password;
    const token=jwt.sign({email:existingUser.email,id:existingUser._id},secret,{expiresIn:'5m'});   
    const link = `http://localhost:8050/api/v1/users/passwordreset/${existingUser._id}/${token}`;
    const reso=mailSender(existingUser.email,link)
    
    console.log(link);
    return res.status(200).json({message:"Email sent successfully"})
}
export const passwordReset = async (req, res,next) => {
  const { id, token } = req.params;
  console.log(req.params);

  const existingUser = await User.findById({ _id: id });
  if (!existingUser) {
    return next(new ErrorHandler(422, "User does not exist"));
  }
  const secret = jwtSecret + existingUser.password;
  try {
    const verify = jwt.verify(token, secret);
    // Render a template instead of sending JSON response
    return res.render("forget", { email: verify.email,status:"not verified"});
  } catch (err) {
    return next(new ErrorHandler(401, "Token verification failed"));
  }
};

export const passwordResetPost = async (req, res,next) => {
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;
  console.log(password, confirmPassword)
  // Check if passwords match
  if (password !== confirmPassword) {
    return next(new ErrorHandler(422, "Passwords do not match"));
  }

  // Find the user by ID
  const existingUser = await User.findById({ _id: id });
  if (!existingUser) {
    return next(new ErrorHandler(422, "User does not exist"));
  }

  const secret = jwtSecret + existingUser.password;
  try {
    // Verify the token
    const verify = jwt.verify(token, secret);
    
    // Hash the new password
    
    const hashedPassword = await bcrypt.hash(password, 12);
    // Update user's password
    existingUser.password = hashedPassword;
    // Save the updated user
    await existingUser.save();
    // Render a template indicating password reset success
    return res.render("forget", { email: verify.email, status: "verified" });
  } catch (err) {
    // If token verification fails, return an error
    return next(new ErrorHandler(401, "Token verification failed"));
  }
};


export const logoutUser = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});
