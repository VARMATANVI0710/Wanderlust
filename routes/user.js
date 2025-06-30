const express=require("express");
const router=express.Router();
const wrapasync = require("../utils/wrapasync");
const passport=require("passport");
const{saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js")
//signup
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapasync(userController.signup));

 //login

 router.route("/login")
 .get(userController.renderLoginForm)
 .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

 //logout
 router.get("/logout",userController.logout);

module.exports=router;