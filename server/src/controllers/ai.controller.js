const Candidate = require('../models/Candidate');
const { successResponse, errorResponse } = require('../utils/response');

// Fallback logic for when API quota is exceeded or fails
const generateMockInsights = (manifesto) => {
    return `
    **AI Analysis (Simulation mode):**
    - 🎯 **Key Promise**: Determined to improve student conditions.
    - 📢 **Communication**: Advocates for better transparency.
    - 🤝 **Leadership**: Shows potential for strong representation.
    * ⚠️ **Note**: This candidate has a strong vision but needs specific plans.
    `;
};

const generateMockReport = (candidates) => {
    if (!candidates || candidates.length === 0) return "No data to analyze.";
    const sorted = [...candidates].sort((a, b) => b.votesCount - a.votesCount);
    const winner = sorted[0];

    return `
    **Election Report (Simulation Mode)**
    
    🏆 **Projected Winner**: ${winner.user.name} with ${winner.votesCount} votes.
    
    📊 **Engagement**:
    This election has seen active participation. ${candidates.length} candidates are competing, showing a healthy democratic process.
    
    💡 **Strategic Advice**:
    The winner should focus on fulfilling their manifesto promises immediately. Unity among the class sections will be key to a successful term.
    `;
};

const getCandidateInsights = async (req, res) => {
    try {
        const { candidateId } = req.body;
        const candidate = await Candidate.findById(candidateId).populate('user', 'name');

        if (!candidate) return errorResponse(res, 'Candidate not found', 404);

        const prompt = `You are a strict political analyst. Summarize the following Class Representative manifesto into exactly 3 short bullet points of "Key Promises" and 1 "Potential Weakness". Manifesto: "${candidate.manifesto}"`;

        try {
            const response = await fetch('https://api.x.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: 'You are a helpful election analyst.' },
                        { role: 'user', content: prompt }
                    ],
                    model: 'grok-beta',
                    stream: false
                })
            });

            if (!response.ok) throw new Error("API_FAIL");

            const data = await response.json();
            const insights = data.choices[0]?.message?.content || generateMockInsights(candidate.manifesto);
            successResponse(res, { insights });

        } catch (apiError) {
            console.warn("AI API Failed, using fallback:", apiError.message);
            const insights = generateMockInsights(candidate.manifesto);
            successResponse(res, { insights });
        }
    } catch (error) {
        console.error('AI Controller Error:', error);
        errorResponse(res, 'Failed to generate AI insights', 500, error);
    }
};

const generateElectionReport = async (req, res) => {
    try {
        const candidates = await Candidate.find({ isApproved: true }).select('votesCount position manifesto').populate('user', 'name');

        if (candidates.length === 0) return errorResponse(res, 'No candidates to analyze', 400);

        try {
            const candidatesData = candidates.map(c =>
                `- ${c.user.name}: ${c.votesCount} votes.`
            ).join('\n');

            const prompt = `Analyze this election data for a Class Representative. Data: ${candidatesData}. Provide Winner Prediction, Engagement Analysis, and Advice.`;

            const response = await fetch('https://api.x.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'grok-beta',
                    stream: false
                })
            });

            if (!response.ok) throw new Error("API_FAIL");

            const data = await response.json();
            const report = data.choices[0]?.message?.content;
            successResponse(res, { report });

        } catch (apiError) {
            console.warn("AI Report API Failed, using fallback");
            const report = generateMockReport(candidates);
            successResponse(res, { report });
        }

    } catch (error) {
        console.error('AI Report Error:', error);
        errorResponse(res, 'Failed to generate election report', 500, error);
    }
};

module.exports = { getCandidateInsights, generateElectionReport };
