import mongoose from 'mongoose';
const {Schema} = mongoose;

const leadSchema = new Schema({
  name:{
    type:String,
    trim:true,
    required:true
  },
  email:{
    type:String,
    trim:true,
    required:true,
    lowercase:true

  },
  searchCriteria:{
    location:String,
    country:String,
  },
  status:{
    type:String,
    enum:["pending", "matched", "closed"],
    default:"pending"
  }
}, {timestamps:true});

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;