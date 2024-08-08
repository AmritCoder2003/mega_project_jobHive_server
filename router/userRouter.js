import express from "express";
import passport from "passport";
import {isAuthorized} from "../middleware/check-auth.js"
import {check} from "express-validator"
const userRouter = express.Router();
import {
  createUser,
  loginUser,
  forgetPassword,
  passwordReset,
  logoutUser,
  passwordResetPost,
} from "../controllers/userController.js";

userRouter.post("/signup",[check('name').not().isEmpty().isLength({min:5}).withMessage('Name should be atleast 5 characters').isLength({max:20}).withMessage('Name should be atmost 20 characters'),
    check('email').isEmail().notEmpty().withMessage('Invalid email'),
    check('phone').notEmpty().withMessage('Phone number is required'),
    check('password').notEmpty().isLength({min:8}).withMessage('Password should be atleast 8 characters').isLength({max:20}).withMessage('Password should be atmost 20 ')  ,
   check('confirmPassword').notEmpty().isLength({min:8}).withMessage('Confirm Password should be atleast 8 characters').isLength({max:20}).withMessage('Password should be atmost 20  '),
    check('role').notEmpty().withMessage('Role is required')
],createUser);

userRouter.post(
  "/login",
  [
    check("email").not().isEmpty().withMessage("Email is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password should be atleast 6 characters"),
  ],
  loginUser
);

userRouter.post("/forgetpassword",[check('email').isEmail().withMessage('Invalid email')],forgetPassword);

userRouter.get("/passwordreset/:id/:token",passwordReset);

userRouter.post("/passwordreset/:id/:token", passwordResetPost);

userRouter.get("/logout",isAuthorized,logoutUser);

export default userRouter;