import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    overallRating: {
        type: Number,
        required: true
    },
    workLifeBalance: {
        type: Number,
        required: true
    },
    salaryBenefits: {
        type: Number,
        required: true
    },
    promotions: {
        type: Number,
        required: true
    },
    jobSecurity: {
        type: Number,
        required: true
    },
    skillDevelopment: {
        type: Number,
        required: true
    },
    workSatisfaction: {
        type: Number,
        required: true
    },
    companyCulture:{
        type: Number,
        required: true
    },
    likes:{
        type:String,
        required:true
    },
    dislikes:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    workPolicy:{
        type:String,
       required:true
    },
    currentEmployee:{
        type:String,
        required:true
    },
    employmentType:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    }


},
    { timestamps: true })

export default mongoose.model('CompanyReview', reviewSchema)    