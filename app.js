import "dotenv/config"
import express from "express";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/expressError.js";
import { router as listingRouter } from "./routes/listing.js";
import { router as reviewRouter } from "./routes/review.js";
import { router as userRouter } from "./routes/user.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local"
import User from "./models/user.js"
import leadRouter from "./routes/lead.js";


const app = express();
const port = 8080;
const dbURL = process.env.ATLAS_URL;



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
  
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto :{
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
});


store.on("error", ()=>{
  console.log("ERROR in mongo session store", err)
})


const sessionOption = {
  store,
  secret :process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie:{
    expires: Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly: true,
  }
};



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.errormsg = req.flash("error")
  res.locals.currUser = req.user;
  res.locals.GEOAPIFY_KEY = process.env.GEOAPIFY_KEY

  next();
})

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/leads", leadRouter);

app.use( (req,res,next)=>{
  next(new ExpressError(404,"Page not found!"))
});


app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong!"}=err;
  res.status(statusCode).render("listing/error.ejs",{err})
})



app.listen(port, () => {
  console.log("Server is running on port 8080");
});