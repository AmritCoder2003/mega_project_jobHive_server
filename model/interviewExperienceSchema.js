import mongoose from "mongoose";

const interviewExperienceSchema = new mongoose.Schema({
   companyName:{
       type:String,
       required:true
   },
   status:{
       type:String,
       required:true
   },
   position:{
       type:String,
       required:true
   },
   location:{
       type:String,
       required:true
   },
   date:{
       type:String,
       required:true
   },
   experience:{
       type:String,
       required:true
   },
   likes:{
       type:Number,
       default:0
   },
   dislikes:{
       type:Number,
       default:0
   },
   createdAt:{
       type:Date,
       default:Date.now
   }
},
{timestamps:true})

export default mongoose.model("InterviewExperience",interviewExperienceSchema)