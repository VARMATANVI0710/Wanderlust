const Listing=require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/reviews.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","the user must be logged in!")
        return  res.redirect("/login");
    }
        next();
    }

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing= await Listing.findById(id);
if(!listing.owner._id.equals(res.locals.currentUser._id)){
    req.flash("error","you are not the authorised user");
    return res.redirect(`/listings/${id}`);
}
next();
}

module.exports.reviewAuthor=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
if(!review.author._id.equals(res.locals.currentUser._id)){
    req.flash("error","you are not the authorised user");
    return res.redirect(`/listings/${id}`);
}
next();
}

module.exports.listingValidation=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
       let errMessage=error.details.map((el)=>
        el.message).join(",");
       throw new ExpressError(400,errMessage);
    }
    else{
        next();
    }
}

module.exports.reviewValidation=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
       let errMessage=error.details.map((el)=>
        el.message).join(",");
       throw new ExpressError(400,errMessage);
    }
    else{
        next();
    }
}