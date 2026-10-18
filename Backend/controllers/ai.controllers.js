import { Lead } from "../models/lead.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
    generateLeadSummary,
    generateEmail as generateEmailAI,
    generateSalesInsights as generateSalesInsightsAI,
    isAIConfigured,
} from "../service/ai.service.js";

const resolveLead = async (req) => {
    if (req.body.leadId) {
        const lead = await Lead.findOne({
            _id: req.body.leadId,
            owner: req.user._id,
        });

        if (!lead) throw new ApiError(404, "Lead not found");

        return lead;
    }

    if (req.body.lead) return req.body.lead;

    throw new ApiError(400, "Lead information is required");
};

export const aiStatus = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        Configured: isAIConfigured(),
        model: process.env.GEMINI_MODEL || "gemini-1.5-pro-latest",
    });
});

export const leadSummary = asyncHandler(async (req, res) => {
    const lead = await resolveLead(req);
    const result = await generateLeadSummary(lead);

    if (req.body.leadId) {
        await Lead.updateOne(
            {
                _id: req.body.leadId,
                owner: req.user._id,
            },
            {
                $set: {
                    aiSummary: result.summary,
                    aiRiskScore: result.riskScore,
                },
            }
        );
    }

    res.json({
        success: true,
        ...result,
    });
});

export const generateEmail = asyncHandler(async (req, res) => {
    const lead = await resolveLead(req);
    const { purpose, tone } = req.body;

    const result = await generateEmailAI({
        lead,
        purpose,
        tone,
        sender: {
            name: req.user.name,
            company: req.user.company,
        },
    });

    res.json({
        success: true,
        ...result,
    });
});

export const generateSalesInsights = asyncHandler(async (req, res) => {
    let stats = req.body.stats;

    if (!stats) {
        const leads = await Lead.find({
            owner: req.user._id,
        });

        stats = buildLeadStats(leads);
    }

    const result = await generateSalesInsightsAI(stats);

    res.json({
        success: true,
        ...result,
    });
});

const buildLeadStats = (leads) => {
    const byStatus = {};
    let totalValue = 0;

    for (const l of leads) {
        byStatus[l.status] =
            byStatus[l.status] || { count: 0, value: 0 };

        byStatus[l.status].count += 1;
        byStatus[l.status].value += l.value || 0;

        totalValue += l.value || 0;
    }

    const won = byStatus.won?.count || 0;
    const lost = byStatus.lost?.count || 0;
    const closed = won + lost;

    return {
        totalLeads: leads.length,
        totalPipelineValue: totalValue,
        winRate: closed ? Math.round((won / closed) * 100) : 0,
        stages: byStatus,
    };
};