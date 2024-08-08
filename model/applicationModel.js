import mongoose, { mongo } from "mongoose";
import validator from "validator";
const applicationSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your type"],
        minLength:[5,"Type should be at least 5 characters"],
        maxLength:[20,"Type should be at most 20 characters"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        validate:[validator.isEmail,"Please enter valid email"]
    },
    coverLetter:{
        type:String,
        required:[true,"Please enter your cover letter"],
    },
    phone:{
        type:Number,
        required:[true,"Please enter your phone number"],
    },
    resume:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    applicantId:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        role:{
            type:String,
            enum:["jobseeker"],
            required:true
        }
    },
    employerId:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        role:{
            type:String,
            enum:["employer"],
            required:true
        }
    }


    
})

export default mongoose.model("Application",applicationSchema)