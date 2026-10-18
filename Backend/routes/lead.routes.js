import { Router } from "express";

import {
    createLeads,
    createLead,
    deleteLead,
    getLead,
    reorderLeads,
    updateLead
} from "../controllers/lead.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.patch("/reorder", reorderLeads);

router.route("/")
    .get(createLeads)
    .post(createLead);

router.route("/:id")
    .get(getLead)
    .put(updateLead)
    .delete(deleteLead);

export default router;