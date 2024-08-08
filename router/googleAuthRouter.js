import express from "express";
import { cookie } from "express-validator";
import passport from "passport";

const googleAuthRouter = express.Router();

googleAuthRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleAuthRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login/failed" ,
    successRedirect: "http://localhost:5173/dashboard"
  }),
  
);

googleAuthRouter.get("/login/failed", (req, res) => {
    res.status(401).json({ message: "Login failed",success:false });
});
googleAuthRouter.get("/login/success", (req, res) => {
   if(req.user){
    res.status(200).json({
        success:true,
        message: "Login successful",
        user: req.user,
        cookie: req.session.cookie
    })
   }
});

googleAuthRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("http://localhost:5173");
});

export default googleAuthRouter;