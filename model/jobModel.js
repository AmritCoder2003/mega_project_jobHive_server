import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minLength: [5, 'Title should be at least 5 characters'],
    maxLength: [50, 'Title should be at most 20 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minLength: [10, 'Description should be at least 20 characters'],
    maxLength: [2000, 'Description should be at most 1000 characters']
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
    minLength: [5, 'Company should be at least 5 characters'],
    maxLength: [20, 'Company should be at most 20 characters']
  },
  category: {
    type: String,
    required: [true, 'Job Category is required'],
  },
  country: {
    type: String,
    required: [true, 'Job Country is required'],
  },
  city: {
    type: String,
    required: [true, 'Job City is required'],
  },
  location: {
    type: String,
    required: [true, 'Job Location is required'],
    minLength: [10, 'Job Location should be at least 10 characters'],
  },
  
  salaryFrom: {
    type: Number,
    required: false,
    min: [1000, 'Salary Form should be at least 4 digits'],
    max: [999999999, 'Salary Form should be at most 9 digits'],
  },
  salaryTo: {
    type: Number,
    required: false,
    min: [1000, 'Salary To should be at least 4 digits'],
    max: [999999999, 'Salary To should be at most 9 digits'],
  },
  salaryPeriod: {
    type: String,
    enum: ['monthly', 'annual'],
    default: 'month'
  },
  expired: {
    type: Boolean,
    default: false
  },
  jobPostedOn: {
    type: Date,
    default: Date.now
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Posted By is required']
  },
  type:{
    type:String,
    enum:['fulltime','parttime','internship'],
    default:'fulltime'
  },
   workstation:{
    type:String,
    enum:['onsite','remote','hybrid'],
    default:'onsite'
   }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
