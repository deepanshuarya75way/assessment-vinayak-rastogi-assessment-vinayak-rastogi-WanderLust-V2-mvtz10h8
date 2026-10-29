import Lead from "../models/lead.js";
import Notification from "../models/notification.js";
import sendLeadEmail from "./sendLeadEmail.js";

const escapeRegex = (val)=>{
  val.replace(/[.*+?^{}()|[\]\\]/g, "\\$&");

  const matchesLeads = (lead, listings)=>{
    const {location, country} = lead.searchCriteria;

  }

  if(location){
    const regex = new RegExp(escapeRegex(location), "i");

    if(!regex.test(listing.location||"")){
      return false;
    }
  }

  if(country){
    const regex = new RegExp(escapeRegex(country), "i");

    if(!regex.test(listing.country||"")){
      return false;
    }
  }

  return true;
}

const matchLeads = async (listing)=>{
  const leads = await Lead.find({
    status:{$in:["pending", "matched"]}
  });

  for(const lead of leads){
    const {location, country} = lead.searchCriteria;

    const locationMatches = (listing.location||"").toLowerCase().includes(location.toLowerCase());

    const countryMatches = !country||(listing.country||"").toLowerCase().includes(country.toLowerCase());

    if(!locationMatches||!countryMatches){
      continue;
    }

    let notification;

    try{
      notification = await Notification.create({
        lead:lead._id,
        listing:listing._id,
        status:"pending"
      });
    }
    catch(e){
      if(e.code===11000){
        continue;
      }

      console.error("Can't create notification", e);
      continue;
    }

    try{
      await sendLeadEmail(lead, listing);

      notification.status = "sent";
      notification.sentAt = new Date();
      notification.errorMessage = null;

      await notification.save();

      lead.status = "matched";
      await lead.save();
    }catch(e){
      notification.status = "failed";
      notification.errorMessage = e.message;

      await notification.save();
      console.error("Email failed for lead", e.message);
    }
  }
}

export {matchLeads, escapeRegex}