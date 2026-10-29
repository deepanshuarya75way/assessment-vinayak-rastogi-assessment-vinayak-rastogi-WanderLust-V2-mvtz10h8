import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import User from "../models/user.js";
import passport from "passport";
import { RedirectUrl } from "../middleware.js";
import {logOut, logInPost, logInForm, signUpForm,signUpPost} from "../controllers/user.js"


const router = express.Router();

//signupForm/signUpPost
router
    .route("/signup")
        .get( signUpForm)
        .post(wrapAsync(signUpPost));

router

//loginForm/LoginPost
router
.route("/login")
    .get(logInForm)
    .post(RedirectUrl, passport.authenticate("local", 
{ failureRedirect: "/login", failureFlash:true}), logInPost);

//logout
router.get("/logout", logOut);

export {router};
