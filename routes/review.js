import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/expressError.js";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
import {validateReview ,isLoggedin, isReviewAuthor } from "../middleware.js";
import { delReview, postReview } from "../controllers/review.js";

const router = express.Router({ mergeParams: true });



//review
//post route
router.post("/", isLoggedin, validateReview, wrapAsync(postReview));


// delete a review route
router.delete("/:reviewId", isLoggedin, isReviewAuthor,wrapAsync(delReview))


export {router};

