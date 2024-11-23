import Profile from "../model/profileModel.js";
import ErrorHandler from "../middleware/error.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import User from "../model/userModel.js";
import cloudinary from "cloudinary";

export const createorUpdateProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.body.userId);
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }

  // Ensure the resume is uploaded
  if (!req.files || !req.files.resume) {
    return next(new ErrorHandler(400, "Please upload a resume"));
  }

  // Access resume file from req.files
  const resume = req.files.resume;

  // Validate the resume file type
  const allowedFormats = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(new ErrorHandler(400, "Please upload a valid file format. Please use .png, .jpg, .jpeg, .webp"));
  }

  // Upload the resume to Cloudinary
  let cloudinaryResponse;
  try {
    cloudinaryResponse = await cloudinary.v2.uploader.upload(resume.tempFilePath);
    console.log("Cloudinary response:", cloudinaryResponse);
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return next(new ErrorHandler(500, "Failed to upload resume"));
  }

  // Prepare profile fields
  const { skills, bio } = req.body;
  console.log(req.body);

  // Prepare the profile fields excluding experience and education
  const profileFields = {
    user: req.body.userId,
    bio: req.body.bio,
    skills: req.body.skills ? req.body.skills.split(',').map(skill => skill.trim()) : [],
    social: {
      twitter: req.body['social[twitter]'],
      linkedin: req.body['social[linkedin]'],
      github: req.body['social[github]'],
      leetcode: req.body['social[leetcode]'],
    },
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  };

  try {
    let profile = await Profile.findOne({ user: req.body.userId });
    if (profile) {
      // Update the profile if it already exists
      profile = await Profile.findOneAndUpdate(
        { user: req.body.userId },
        { $set: profileFields },
        { new: true }
      );
      return res.status(200).json({ profile, message: "Profile updated successfully" });
    }

    // Create a new profile if it doesn't exist
    profile = new Profile(profileFields);
    await profile.save();
    return res.status(200).json({ profile, message: "Profile created successfully" });
  } catch (err) {
    console.error("Error saving profile:", err);
    return next(new ErrorHandler(500, "Failed to save profile"));
  }
});

export const getCurrentProfile = catchAsyncError(async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.body.userId }).populate("user", "name email role avatar phone ");
    if (!profile) {
      return next(new ErrorHandler(404, "Profile not found"));
    }
    return res.status(200).json({ profile, message: "Profile found successfully" });
  } catch (err) {
    return next(new ErrorHandler(500, "Failed to get profile"));
  }
});
