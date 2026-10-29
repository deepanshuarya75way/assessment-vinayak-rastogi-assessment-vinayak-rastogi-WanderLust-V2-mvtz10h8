import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendLeadEmail = async(lead, listing)=>{
  const listingUrl = `${process.env.BASE_URL || "http://localhost:5500"}/listing/${listing._id}`

  await transporter.sendMail({
    from:process.env.EMAIL_USER,
    to:lead.email,
    subject:"A new listing available",
    html:`
      <h2>Hello User</h2>

      <p> A new travel listing matching your search is now available</p>

      <a href="${listingUrl}">View Listing</a>
    `
  })
};

function escapeHTML(val){
  return String(val).replace(/[&<>"']/g, (char)=>({
    "&":"&amp;",
    "<":"&lt;",
    '"':"&quot;",
    "'":"&#39;"
  })[char]);
}

export default sendLeadEmail;