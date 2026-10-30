import mongoose from "mongoose";
import Listing from "../models/listing.js";
import PricingRule from "../models/pricingRules.js";

const findOwnedListing = async (listingId, userId) => {
  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new Error("Listing not found");
  }

  if (listing.owner.toString() !== userId.toString()) {
    throw new Error("Not authorized to manage pricig");
  }

  return listing;
};

const getRuleData = (body) => {
  const { name, adjustmentType, value, priority} = body;

  const conditions = body.conditions || {};

  const nullableNumber = (val) =>
    val === "" || val === undefined || val === null ? null : Number(val);

  return {
    name, adjustmentType, value: Number(value), priority: priority === "" || priority === undefined ? 0 : Number(priority),

    conditions: {
      startDate: conditions?.startDate || null,
      endDate: conditions?.endDate || null,

      minNights: nullableNumber(conditions.minNights),
      maxNights: nullableNumber(conditions.maxNights),

      minGeusts: nullableNumber(conditions.minGeusts),
      maxGeusts: nullableNumber(conditions.maxGeusts),

      minAdvanceDays: nullableNumber(conditions.minAdvanceDays),
      maxAdvanceDays: nullableNumber(conditions.maxAdvanceDays),
    }
  };
};

export const index = async (req, res) => {
  const { id } = req.params;

  const listing = await findOwnedListing(id, req.user._id);

  const rules = await PricingRule.find({ listing: listing._id }).sort({ priority: -1 });

  res.render("pricing/index.ejs", { listing, rules });
};

export const newRule = async (req, res) => {
  const { id } = req.params;

  const listing = await findOwnedListing(id, req.user._id);

  const rule = {
    name:"",
    adjustmentType:"pecentageDiscount",
    value:0,
    priority:0,
    conditions:{}
  }

  res.render("pricing/new.ejs", { listing, rule });
};

export const create = async (req, res) => {
  const { id } = req.params;
  const listing = await findOwnedListing(id, req.user._id);

  const ruleData = getRuleData(req.body);

  const pricingRule = new PricingRule({
    ...ruleData,
    listing: listing._id,
  });

  await pricingRule.save();

  req.flash("success", "Pricing rule created succesfully");
  res.redirect(`/listings/${listing._id}/pricing-rules`);
}

export const edit = async (req, res) => {
  const { id, ruleId } = req.params;
  const listing = await findOwnedListing(id, req.user._id);

  const rule = await PricingRule.findOne({ _id: ruleId, listing: listing._id });

  if (!rule) {
    req.flash("error", "Pricing rule not found.");
    return res.redirect(`/listings.${id}/pricing-rules`);
  }

  res.render("pricing/edit.ejs", { listing, rule });
};

export const update = async (req, res)=>{
  const { id, ruleId } = req.params;
  const listing = await findOwnedListing(id, req.user._id);

  const rules = await PricingRule.findOne({ _id: ruleId, listing: listing._id });

  if (!rules) {
    req.flash("error", "Pricing rule not found.");
    return res.redirect(`/listings.${id}/pricing-rules`);
  }

  const oldConfig = {
    name:rules.name,
    adjustmentType:rules.adjustmentType,
    value:rules.value,
    conditions:rules.conditions,
    priority:rules.priority,
    isActive:rules.isActive
  };

  rules.history.push({
    version:rules.version,
    config:oldConfig,
    changedAt:new Date(),
  });

  const ruleData = getRuleData(req.body);

  rules.name = ruleData.name;
  rules.adjustmentType = ruleData.adjustmentType;
  rules.value = ruleData.value;
  rules.conditions = ruleData.conditions;
  rules.priority = ruleData.priority;
  
  rules.version +=1;

  await rules.save();

  req.flash("success", "Pricing rules updated");

  res.redirect(`/listings/${id}/pricing-rules`);
};

export const toggle = async (req, res)=>{
  const {id, ruleId}= req.params;

  const listing = await findOwnedListing(id, req.user._id);

  const rules = await PricingRule.findOne({ _id: ruleId, listing: listing._id });


 if (!rules) {
    req.flash("error", "Pricing rule not found.");
    return res.redirect(`/listings.${id}/pricing-rules`);
  }

  rules.isActive = !rules.isActive;

  await rules.save();

  req.flash("success", `Pricing rules ${rules.isActive? "activated":"deactivated"} succesfully!`);

  res.redirect(`/listings/${id}/pricing-rules`);
};


export const deleteRule = async (req, res)=>{
   const {id, ruleId}= req.params;

  const listing = await findOwnedListing(id, req.user._id);

  await PricingRule.findOneAndDelete({ _id: ruleId, listing: listing._id });


    req.flash("success", "Pricing rule deleted.");
    return res.redirect(`/listings.${id}/pricing-rules`);
};
