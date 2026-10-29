import Listing from "../models/listing.js";
import Lead from "../models/lead.js";
import { matchLeads } from "../utils/matchLeads.js";

const category = [
  "Rooms",
  "Iconic Cities",
  "Mountains",
  "Lakefront",
  "Amazing Pools",
  "Amazing Views",
  "Beach",
  "Castles",
  "Cabin",
  "Camp",
  "Farms",
  "Snow",
];

const parseIsAvailable = (val)=>{
  if(Array.isArray(val)){
    return val.includes("true")||val.includes(true)||val.includes("on")
  }
  return val==="true"||val===true||val==="on"
}

const index = async (req, res) => {
  const search = req.query.search?.trim();
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  const sort = req.query.sort;
  const page = Math.max(1, parseInt(req.query.page, 10)||1);
  const limit = 6;
  
  const filter = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { country: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const selectedCategory = category.find((item)=>item.toLowerCase()=== req.query.category?.toLowerCase());

  if (selectedCategory) {
    filter.tags = selectedCategory;
  }

  let sortBy = {};

  if (sort === "price_asc") {
    sortBy = { price: 1 };
  } else if (sort === "price_desc") {
    sortBy = { price: -1 };
  } else if (sort === "names_asc") {
    sortBy = { title: 1 };
  } else if (sort === "names_desc") {
    sortBy = { title: -1 };
  }

  if(maxPrice||minPrice){
    filter.price = {};

    if(minPrice){
      filter.price.$gte = Number(minPrice);
    }

    if(maxPrice){
      filter.price.$lte = Number(maxPrice);
    }
  }

  const totListings = await Listing.countDocuments(filter);
  const totPages = Math.ceil(totListings/limit);

  const allListing = await Listing.find(filter).sort(sortBy).skip((page-1)*limit).limit(limit);
  res.render("listing/index", { allListing, search, sort, selectedCategory, page, limit, totPages, minPrice, maxPrice});
};

const newRoute = async (req, res) => {
  res.render("listing/new.ejs", { category });
};

const create = async (req,res, next)=>{
    // 1️⃣ Forward geocoding: place name → coordinates
  const geoRes = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      req.body.listing.location
    )}&apiKey=${process.env.GEOAPIFY_KEY}`
  );

  const geoData = await geoRes.json();

  if (!geoData.features || geoData.features.length === 0) {
    req.flash("error", "Location not found");
    return res.redirect("/listings/new");
  }

  const coordinates = geoData.features[0].geometry.coordinates;

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing=new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename}
  newListing.geometry = {type: "Point", coordinates};
  let geotude=await newListing.save();
  console.log(geotude)
  try{
    await matchLeads(newListing);
  }catch(e){
    console.error("Error processing lead matches", e);
  }
  req.flash("success", "Listing created successfully!")
  return res.redirect("/listings")
}


const showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  res.render("listing/show.ejs", { listing });
};

const edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  let originalImage = listing.image.url;
  let originalImageUrl = originalImage.replace("/upload", "/upload/w_250");
  res.render("listing/edit.ejs", { listing, originalImageUrl });
};

const update = async (req, res) => {
  let { id } = req.params;
  // 👉 IMPLEMENTATION: forward geocoding (place → coordinates)
  const geoRes = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      req.body.listing.location,
    )}&apiKey=${process.env.GEOAPIFY_KEY}`,
  );

  const geoData = await geoRes.json();

  if (!geoData.features || geoData.features.length === 0) {
    req.flash("error", "Location not found");
    return res.redirect(`/listings/${id}/edit`);
  }

  // attach geometry to update payload
  req.body.listing.geometry = {
    type: "Point",
    coordinates: geoData.features[0].geometry.coordinates,
  };
  req.body.listing.isAvailble = parseIsAvailable(req.body.listing?.isAvailable);
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

const deleteRoute = async (req, res) => {
  let { id } = req.params;
  let delListing = await Listing.findByIdAndDelete(id);
  console.log(delListing);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};

const createLead = async (req, res)=>{
  const {id} = req.params;
  const listing = await Listing.findById(id);

  if(!listing){
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  const {name, email, phone, message} = req.body.lead || req.body;

  if(!name|| !email|| !message){
    req.flash("error", "Please fill in your name, email, phone, message.");
    return res.redirect(`listing/${id}`);
  }

  const lead = new Lead({
    listing:listing._id,
    name, email, phone: phone || "", message,
  });

  await lead.save();
  req.flash("success", "Thanks! We have captured your intrest for this listing.");
  return res.redirect(`listing/${id}`);
}

export { index, newRoute, create, showListing, edit, update, deleteRoute, createLead };
