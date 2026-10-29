import Joi from "joi";

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().min(10).required(),
    location: Joi.string().trim().min(2).required(),
    country: Joi.string().trim().min(2).required(),
    price: Joi.number().min(0).precision(2).required(),
    image: Joi.string().uri().allow("", null),
    isAvailable: Joi.boolean().optional(),
    lat: Joi.number().optional(),
    lng: Joi.number().optional(),
    tags: Joi.array().items(
      Joi.string().valid(
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
      ),
    ).default([]),
  }).required(),
}).required();

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().trim().min(2).required(),
  }).required(),
});

export { listingSchema, reviewSchema };
