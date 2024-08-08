import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../model/userModel.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID_NEW,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_NEW,
      callbackURL: "http://localhost:8050/emp/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await userModel.findOne({
          email: profile.emails[0].value,
        });
        if (!user) {
          user = new userModel({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: "employer",
          });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);


passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
