import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  resume: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  skills: {
    type: [String]
  },
  bio: {
    type: String
  },
  social: {
    twitter: { type: String },
    linkedin: { type: String },
    github: { type: String },
    leetcode: { type: String }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Profile", profileSchema);
