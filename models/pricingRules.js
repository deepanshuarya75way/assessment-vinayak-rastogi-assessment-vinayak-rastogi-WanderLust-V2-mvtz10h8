import mongoose from "mongoose";

const {Schema} = mongoose;

const conditionSchema = new Schema({
  startDate:{
    type:Date,
    default:null,
  },
  endDate:{
    type:Date,
    default:null,
  },
  minNights:{
    type:Number,
    min:1,
    default:null,
  },
  maxNights:{
    type:Number,
    min:1,
    default:null,
  },
  maxGeusts:{
    type:Number,
    min:1,
    default:null,
  },
  minGeusts:{
    type:Number,
    min:1,
    default:null,
  },
  minAdvanceDay:{
    type:Number,
    min:0,
    default:null,
  },
  minAdvanceDay:{
    type:Number,
    min:0,
    default:null,
  },
},
{_id:false});


const ruleConfigSchema = new Schema({
  name:{
    type:String,
    required:true,
    trim:true,
  },
  adjustmentType:{
    type:String,
    enum:["percentageIncrease", "percentageDiscount", "fixedIncrease", "fixedDiscount"],
    required:true,
  },

  value:{
    type:Number,
    required:true,
    min:0,
  },
  priority:{
    type:Number,
    default:0,
  },
  isActive:{
    type:Boolean,
    default:true,
  },
  conditions:{
    type:conditionSchema,
    default:()=>({})
  }
},
{_id:false});


const pricingRuleSchema = new Schema({
  listing:{
    type:Schema.Types.ObjectId,
    ref:"Listing",
    required:true,
    index:true,
  },
  ...ruleConfigSchema.obj,

  version:{
    type:Number,
    default:1,
    min:1,
  },
  history:[{
    version:{
      type:Number,
      required:true,
    },

    config:{
      type:ruleConfigSchema,
      required:true,

    },
    changedAt:{
      type:Date,
      default:Date.now,
    },
  }]
},
{timestamps:true});


pricingRuleSchema.pre("validate", function (){
  if(["percentageIncrease", "percentageDiscount"].includes(this.adjustmentType)&&this.value>100){
    this.invalidate("value", "Percentage adjustment can't exceed 100");
  }

  const c = this.conditions||{};

  if(c.startDate && c.endDate && c.startDate > c.endDate){
    this.invalidate("conditions.endDate", "End date must be after start date.");
  }

  if(c.minNights!=null&&c.maxNights!=null&&c.minNights> c.maxNights){
    this.invalidate("conditions.maxNights", "Maximum nights must be atleast equal to minimum nights");
  }

  if(c.minGeusts!=null&&c.maxGeusts!=null&&c.minGeusts> c.maxGeusts){
    this.invalidate("conditions.maxGeusts", "Maximum geusts must be atleast equal to minimum geusts");
  }

  if(c.minAdvanceDays!=null&&c.maxAdvanceDays!=null&&c.minAdvanceDays> c.maxAdvanceDays){
    this.invalidate("conditions.maxAdvanceDays", "Maximum advance days must be atleast equal to minimum advance days");
  }
});

const PricingRule = mongoose.model("PricingRule", pricingRuleSchema);

export default PricingRule;