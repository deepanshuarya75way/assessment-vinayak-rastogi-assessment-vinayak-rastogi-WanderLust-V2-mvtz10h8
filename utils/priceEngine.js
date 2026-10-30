import PricingRule from "../models/pricingRules.js";

const DAYS_MS = 24 * 60 * 60 * 1000;

const toDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  return date;
}

const startOfDayUTC = (date) =>Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

  const getNights = (checkIn, checkOut) => {
    const start = startOfDayUTC(checkIn);
    const end = startOfDayUTC(checkOut);

    return Math.round((end - start) / DAYS_MS);

  };

  const matchesRule = (rule, context) => {
    const { date, nights, geusts, advanceDays } = context;

    const conditions = rule.conditions || {};

    if (conditions.startDate && date < startOfDayUTC(toDate(conditions.startDate))) {
      return false;
    }

    if (conditions.endDate && date > startOfDayUTC(toDate(conditions.endDate))) {
      return false;
    }

    if (conditions.minNights != null && nights < conditions.minNights) {
      return false
    }

    if (conditions.maxNights != null && nights > conditions.maxNights) {
      return false
    }

    if (conditions.minGeusts != null && geusts < conditions.minGeusts) {
      return false
    }

    if (conditions.maxGeusts != null && geusts > conditions.maxGeusts) {
      return false
    }


    if (conditions.minAdvanceDays != null && advanceDays < conditions.minAdvanceDays) {
      return false
    }

    if (conditions.maxAdvanceDays != null && advanceDays > conditions.maxAdvanceDays) {
      return false
    }

    return true;
  };

  const calculateAdjustments = (basePrice, rule) => {
    switch (rule.adjustmentType) {
      case "percentageIncrease":
        return basePrice * (rule.value / 100);
      case "percentageDiscount":
        return -(basePrice * (rule.value / 100));
      case "fixedIncrease":
        return rule.value;
      case "fixedDiscount":
        return -rule.value;
      default:
        throw new Error(`Unsupported adjusment type: ${rule.adjustmentType}`);
    }
  };

  export const calculateQuote = async ({ listingId, basePrice, checkIn, checkOut, geusts = 1, }) => {
    if (!listingId) {
      throw new Error("Listing Id is required!");

    }

    if (!Number.isFinite(basePrice) || basePrice < 0) {
      throw new Error("Invalid base price");
    }

    if (!Number.isInteger(geusts) || geusts < 1) {
      throw new Error("Geust count must be positive");
    }

    const start = toDate(checkIn);
    const end = toDate(checkOut);

    const nights = getNights(start, end);

    if (nights <= 0) {
      throw new Error("Check out must be after check in");
    }

    const today = startOfDayUTC(new Date());

    const advanceDays = Math.floor((startOfDayUTC(start) - today) / DAYS_MS);

    if (advanceDays < 0) {
      throw new Error("Check in can't be in past");
    }

    const rules = await PricingRule.find({ listing: listingId, isActive: true, }).sort({ priority: -1, createdAt: 1 });

    let total = 0;
    const breakdown = [];

    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(startOfDayUTC(start) + i * DAYS_MS);


      const matchingRule = rules.find((rule) => matchesRule(rule, {
        date: startOfDayUTC(currentDate),
        nights,
        geusts,
        advanceDays,
      }));

      const item = {

        date: currentDate.toISOString().slice(0, 10),
        basePrice,
        appliedRule: null,
        adjustment: 0,
        finalPrice: basePrice,
      };

      if (matchingRule) {
        const adjustment = calculateAdjustments(basePrice, matchingRule);

        const finalPrice = Math.max(0, basePrice + adjustment);

        item.appliedRule = {
          id: matchingRule._id,
          name: matchingRule.name,
          adjustmentType: matchesRule.adjustmentType,
          value: matchesRule.value,
          priority: matchingRule.priority,
        };

        item.adjustment = Number((finalPrice - basePrice).toFixed(2));
        item.finalPrice = Number(finalPrice.toFixed(2));
      }

      total += item.finalPrice;
      breakdown.push(item);
    }
    return {listingId, checkIn:start.toISOString(), checkOut:end.toISOString(), nights, geusts, baseTotal:Number((basePrice*nights).toFixed(2)),
      total: Number(total.toFixed(2)),
      savings:Number((basePrice*nights-total).toFixed(2)),
      breakdown
    };
  };