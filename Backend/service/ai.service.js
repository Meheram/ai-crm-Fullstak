import { GoogleGenAI } from "@google/genai";
import { ApiError } from "../utils/apiError.js";
import { config } from "dotenv";

config();

let client = null;

const getClient = () => {
    const apikey = process.env.GEMINI_API_KEY;

    if (!apikey) {
        throw new ApiError(503, "Please provide a valid API key");
    }

    if (!client) {
        client = new GoogleGenAI({
            apiKey: apikey,
        });
    }

    return client;
};

const MODEL = () =>
    process.env.GEMINI_MODEL || "gemini-1.5-pro-latest";

export const isAIConfigured = () =>
    Boolean(process.env.GEMINI_API_KEY);

const generateJSON = async (prompt, schema) => {
    const ai = getClient();

    try {
        const response = await ai.models.generateContent({
            model: MODEL(),
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.6,
                responseSchema: schema,
            },
        });

        return JSON.parse(response.text);
    } catch (err) {
        console.error(
            "Gemini API error",
            err?.message || err
        );

        throw new ApiError(
            503,
            "Error generating JSON"
        );
    }
};

const generateText = async (
    prompt,
    temperature = 0.7
) => {
    const ai = getClient();

    try {
        const response = await ai.models.generateContent({
            model: MODEL(),
            contents: prompt,
            config: {
                temperature,
            },
        });

        return response.text.trim();
    } catch (err) {
        console.error(
            "Gemini API error",
            err?.message || err
        );

        throw new ApiError(
            503,
            "Error generating text"
        );
    }
};

export const generateLeadSummary = async (lead) => {
    const prompt = `
Generate a summary of the lead ${lead.name} from ${lead.company} in JSON format.

Lead details:
Name: ${lead.name || "N/A"}
Company: ${lead.company || "N/A"}
Email: ${lead.email || "N/A"}
Current pipeline stage: ${lead.status || "New"}
Potential deal value: $${lead.value || 0}
Source: ${lead.source || "Unknown"}
Notes: ${lead.notes || "None"}

Return JSON only.
`;

    const schema = {
        type: "object",
        properties: {
            summary: {
                type: "string",
                description: "The summary of the lead",
            },
            riskScore: {
                type: "integer",
                description: "The risk score of the lead",
            },
            suggestedPriority: {
                type: "string",
                enum: ["Low", "Medium", "High"],
            },
            nextBestAction: {
                type: "string",
                description: "The next best action for the lead",
            },
        },
        required: [
            "summary",
            "riskScore",
            "suggestedPriority",
            "nextBestAction",
        ],
    };

    return generateJSON(prompt, schema);
};

export const generateEmail = async ({
    lead,
    purpose,
    tone,
    sender,
}) => {
    const prompt = `
You are a senior sales rep writing on behalf of ${
        sender?.name || "our team"
    } ${sender?.company ? `at ${sender.company}` : ""}.

Write a professional sales email.

Purpose: ${purpose || "follow-up"}
Desired tone: ${tone || "friendly and professional"}

Recipient details:
Name: ${lead?.name || "there"}
Company: ${lead?.company || "N/A"}
Pipeline stage: ${lead?.status || "New"}
Content / notes: ${lead?.notes || "None"}

Return JSON only with a compelling subject line and a complete email body.
Use line breaks (\\n) in the body.
Keep it under 180 words.
Sign off as ${sender?.name || "the TTP CRM team"}.
`;

    const schema = {
        type: "object",
        properties: {
            subject: {
                type: "string",
                description: "The email subject line",
            },
            body: {
                type: "string",
                description: "The complete email body",
            },
        },
        required: ["subject", "body"],
    };

    return generateJSON(prompt, schema);
};

export const generateSalesInsights = async (
    pipelineStats
) => {
    const prompt = `
You are a revenue operations analyst.

Analyze the following sales pipeline statistics and provide insights in JSON format.

Include:
- key trends
- potential risks
- actionable recommendations to improve conversion

Pipeline snapshot:
${JSON.stringify(pipelineStats, null, 2)}

Return JSON only.
`;

    const schema = {
        type: "object",
        properties: {
            headline: {
                type: "string",
                description:
                    "A headline summarizing the sales pipeline insights",
            },

            insights: {
                type: "array",
                description:
                    "Key trends and insights from the sales pipeline",
                items: {
                    type: "string",
                },
            },

            recommendations: {
                type: "array",
                description:
                    "Actionable recommendations to improve conversion",
                items: {
                    type: "string",
                },
            },

            healthScore: {
                type: "number",
                description:
                    "A numerical score representing the overall health of the sales pipeline",
            },
        },

        required: [
            "headline",
            "insights",
            "recommendations",
            "healthScore",
        ],
    };

    return generateJSON(prompt, schema);
};

export { generateText };