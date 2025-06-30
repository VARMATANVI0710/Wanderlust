//Repositoryfortheproject:https://github.com/apna-college/wanderlustvarmatanvi0710@gmail.com
//httpOnly //cross-site scripting
//SH256 is fast algo to removing hash forms if 
//hacker by using some algo remove hassh form and match with commonly used passwords
//so using show algo is benefincial
if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
const dburl=process.env.ATLASDB_URL;
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const User = require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");

const passport=require("passport");
const LocalStrategy=require("passport-local");

const store=MongoStore.create({
 mongoUrl:dburl,
 crypto:{
    secret:process.env.SECRET,
 },
 touchAfter:24*3400,

});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STRORE",err);
});
   
const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,//cross scripting attackes
    }
}



app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

main()
  .then(()=>{
    console.log("connection successful");
   })
.catch((err)=>{
    console.log(err);
   });

async function main(){
    await mongoose.connect(dburl);
};

// app.get("/",(req,res)=>{
//     res.send("hello i am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"reha@gmail.com",
//         username:"reha123Delta"
//     });

//     let registeredUser =await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
// app.get("/testlisting",async (req,res)=>{
//     let sampleListing=new Listing({
//      title:"My New Villa",
//      description:"By the beach",
//      price:1200,
//      location:"Calangut,Goa",
//      country:"India",
//     });
//     await sampleListing.save();
//     res.send("succesful");
// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

//error handling middleware
app.use((err,req,res,next)=>{
   let{statusCode=500,message="something went wrong"}=err;
   res.status(statusCode).render("error.ejs",{message});
});

//root route

app.listen(8080,()=>{
    console.log("the server is listening on port 8080 ");
});


