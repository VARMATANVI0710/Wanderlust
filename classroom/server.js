const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

let sessionoption={secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionoption));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.sucmsg=req.flash("success");
    res.locals.errmsg=req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous"){
        req.flash("error","user not registered");
    }else{
        req.flash("success","User registered sucessfully");
    }
    
    
    res.redirect("/hello");
   
});

app.get("/hello",(req,res)=>{
    // console.log(req.flash("success"));
    res.render("page.ejs",{name:req.session.name,msg:req.flash("success")});
});

// app.get("/reqcount",(req,res)=>{
//     if( req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }
//      //req.session that  trackes the particular session request send and "count" the variable used here
//     res.send(`You have sent a request ${req.session.count} times`);
// })

// app.get("/test",(req,res)=>{
//     res.send("test successful!");
// });

app.listen(3000,()=>{
    console.log("listening on port 3000")
});