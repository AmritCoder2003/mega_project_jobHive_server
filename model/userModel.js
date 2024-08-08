import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      minLength: [5, "Name should be at least 5 characters."],
      maxLength: [20, "Name should be at most 20 characters."],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: [validator.isEmail, "Please enter valid email."],
    },
    phone: {
      type: Number,
      required: [true, "Please enter your phone number."],
    },
    password: {
      type: String,
      required: [true, "Please enter your password."],
      minLength: [8, "Password should be at least 8 characters."],
      maxLength: [20, "Password should be at most 20 characters."],
      select: false,
    },
    role: {
      type: String,
      enum: ["jobseeker", "employer", "admin"],
      required: [true, "Please enter your role."],
    },
    avatar: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fHww",
      required: [true, "Please upload your avatar."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

// Hashing the password before saving
UserSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,12);
    next();
});

// Compare user password
UserSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

// Generate JWT token

UserSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
}

export default mongoose.model('User',UserSchema)

