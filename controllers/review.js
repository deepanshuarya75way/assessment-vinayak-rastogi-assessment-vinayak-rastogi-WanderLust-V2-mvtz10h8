import Listing from "../models/listing.js";
import Review from "../models/review.js";

//post review
const postReview = async (req,res)=>{
  let {id}= req.params;

  let listing = await Listing.findById(id)
  let newReview = new Review(req.body.review)
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save()
  await listing.save()
  req.flash("success", "Review added successfully!")
  res.redirect(`/listings/${id}`)
}

// delete a review route
const delReview = async (req,res)=>{
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId)
  req.flash("success", "Review deleted successfully!")


  res.redirect(`/listings/${id}`)

}


export {delReview, postReview}