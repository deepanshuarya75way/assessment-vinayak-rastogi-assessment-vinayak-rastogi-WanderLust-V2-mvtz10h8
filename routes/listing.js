import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
import {validateListing, isLoggedin, isOwner } from "../middleware.js";
import {create, index, newRoute, showListing, edit, update, deleteRoute, createLead} from "../controllers/listings.js";
import multer from "multer";


const router = express.Router();
import { storage } from "../cloudConfig.js";
const upload = multer({storage})

//index route & Create route
router
    .route("/")
        .get(wrapAsync(index))
        .post(isLoggedin, upload.single("listing[image]"),  validateListing, wrapAsync(create));



//new route
router.get("/new", isLoggedin, wrapAsync(newRoute))

//new lead
router.post("/:id/leads", wrapAsync(createLead));


//show / update / delete
router
    .route("/:id")
        .get(wrapAsync(showListing))
        .put(isLoggedin, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(update))
        .delete(isLoggedin, isOwner,wrapAsync(deleteRoute));

//edit route
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(edit))



export {router};

