import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {isLoggedin} from "../middleware.js";

import {index, newRule, create, edit, update, toggle, deleteRule} from "../controllers/pricingRules.js";

const router = express.Router({mergeParams:true});

router.get("/", isLoggedin, wrapAsync(index));

router.get("/new", isLoggedin, wrapAsync(newRule));

router.post("/", isLoggedin, wrapAsync(create));

router.get("/:ruleId/edit", isLoggedin, wrapAsync(edit));

router.put("/:ruleId", isLoggedin, wrapAsync(update));

router.patch("/:ruleId/toggle", isLoggedin, wrapAsync(toggle));

router.delete("/:ruleId", isLoggedin, wrapAsync(deleteRule));

export default router;