import mongoose from 'mongoose';
const {Schema} = mongoose;

const notificationSchema = new Schema({
  lead:{
    type:Schema.Types.ObjectId,
    ref:"Lead",
    required:true,
  },
  listing:{
    type:Schema.Types.ObjectId,
    ref:"Listing",
    required:true,
  },
  status:{
    type:String,
    enum:["pending", "matched", "closed", "failed", "sent"],
    default:"pending"
  },
  sentAt:Date
  
}, {timestamps:true});

notificationSchema.index(
  {lead:1, listing:1},
  {unique:true}
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;