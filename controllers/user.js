import User from "../models/user.js";


const signUpForm = (req,res)=>{
    res.render("users/signup.ejs");
}

const signUpPost = async(req,res,next)=>{
   try{
    let {username, email, password } = req.body; 
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      req.flash("error", "Email already registered");
      return res.redirect("/signup");
    }

   const newUser = new User({email, username})
   const registeredUser = await User.register(newUser, password);
   console.log(registeredUser)
   req.login(registeredUser, (err)=>{
    if(err){
        return next(err);
    }
            req.flash("success","Welcome to WanderLust")
        res.redirect("/listings")

   })

   } catch(e){
        req.flash("error", e.message)
        res.redirect("/signup")
   }

}

const logInForm = (req,res)=>{
    res.render("users/login.ejs")
}


const logInPost = async (req,res)=>{
    req.flash("success","Welcome back to WanderLust!");
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl)
    }else{
        res.redirect("/listings")
    }
    
}


const logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","Visit again sometime!")
        res.redirect("/listings")
    })
}


export {logOut, logInPost, logInForm, signUpForm,signUpPost}