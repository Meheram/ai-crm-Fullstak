import {Router} from "express";
import {
    aiStatus,
    leadSummary,
    generateEmail,
    generateSalesInsights
} from "../controllers/ai.controllers.js";
import {protect} from "../middleware/auth.middleware.js";

const router = Router();
router.use(protect);

router.get("/status", aiStatus);
router.post("/lead-summary", leadSummary);
router.post("/email", generateEmail);
router.post("/sales-insights", generateSalesInsights);

export default router;