import "dotenv/config";
import mongoose from "mongoose";
import {calculateQuote} from "./utils/priceEngine.js";

await mongoose.connect(process.env.ATLAS_URL);

try{
  const quote = await calculateQuote({
    listingId:"697663c55a95d349e51a0f2f",
    basePrice:1200,
    checkIn:"2026-12-20",
    checkOut:"2026-12-25",
    geusts:2,
  });
  console.log(quote, {depth:null});
}catch(err){
  console.error(err.message);
}finally{
  await mongoose.disconnect();
}