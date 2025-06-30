const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const {reviewValidation,isLoggedIn,reviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js")
// Post review route
router.post("/",isLoggedIn,reviewValidation,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,reviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;
