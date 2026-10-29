import express from "express";

const router = express.Router();

import {createLead, renderLeadForm} from "../controllers/lead.js";

router.get("/lead-form", renderLeadForm)
router.post("/", createLead);

export default router;