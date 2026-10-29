import Listing from "./models/listing.js";
import Review from "./models/review.js";
import ExpressError from "./utils/expressError.js";
import { listingSchema, reviewSchema} from "./schema.js";

const isLoggedin = (req,res,next)=>{
      if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
    req.flash("error","Login to use this feature!");
    return res.redirect("/login");
  } 
  next();
}

const RedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    
  }
  next();
}

const isOwner =  async (req,res,next)=>{
  let {id}= req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "You don't have permission")
    return res.redirect(`/listings/${id}`)
  }
  next();
}

const validateListing = (req,res,next)=>{

  if(req.body.listing){
    const value = req.body.listing.isAvailable;
    req.body.listing.isAvailable = value==="true"||value===true||value==="on";
  }

  if(req.body.listing?.tags !== undefined){
    if(!Array.isArray(req.body.listing.tags)){
      req.body.listing.tags = [req.body.listing.tags];
    }
  }

  let {error}= listingSchema.validate(req.body);
  if(error){
    let errMsg= error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400, errMsg)
  }else{
    next();
  }
}

const validateReview = (req,res,next)=>{
  let {error}= reviewSchema.validate(req.body);
  if(error){
    let errMsg= error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400, errMsg)
  }else{
    next();
  }
}

const isReviewAuthor =  async (req,res,next)=>{
  let {reviewId, id}= req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "You don't have permission")
    return res.redirect(`/listings/${id}`)
  }
  next();
}

export {isReviewAuthor,validateListing, validateReview,isLoggedin, RedirectUrl, isOwner};