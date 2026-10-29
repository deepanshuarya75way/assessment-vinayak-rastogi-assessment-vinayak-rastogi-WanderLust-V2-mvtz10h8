import Lead from "../models/lead.js";

const renderLeadForm = (req, res)=>{
    res.render("listing/leads.ejs");
}

const createLead = async (req, res)=>{
    console.log("CreateLead called");
    console.log("Req body:", req.body)
    try {
        const {name, email, location, country} = req.body;

        console.log("VAidationg Input")

        console.log("Name", typeof name, JSON.stringify(name));
        console.log("Email", typeof email, JSON.stringify(email));
        console.log("Location", typeof location, JSON.stringify(location));
        

        if(typeof name!=="string"||typeof email!=="string"||typeof location!=="string"||!name.trim()||!email.trim()||!location.trim()){
            console.log("Failed req field validation")
            req.flash("error", "Please Provide a valid name and email");
            return res.redirect("/leads/lead-form");
        }

        console.log("passed req field validation");

        const normalizeEmail = email.trim().toLowerCase();
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail);

        if(!validEmail){
            console.log("Failed email field validation")
            req.flas("error", "Please enter a valid email.")
            return res.redirect("/leads/lead-form");
        }

        console.log("Email Verified")

        const lead = new Lead({
            name:name.trim(),
            email:normalizeEmail,
            searchCriteria:{
                location:location?.trim(),
                country:typeof country==="string"? country.trim():""
            },
        })

        console.log("Lead Obj created", lead)

        await lead.save();

        console.log("Lead Obj saved", lead._id)

        req.flash("success", "Your request has been saved");

        return res.redirect("/leads/lead-form");
    } catch (e) {
        console.error("Error", e);
         req.flash("error", "Your request has not been saved");
         return res.redirect("/leads/lead-form");
    }
}


export {createLead, renderLeadForm};