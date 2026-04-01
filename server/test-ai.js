require('dotenv').config();

async function testAI() {
    console.log("Testing xAI API Connection...");
    console.log("API Key present:", !!process.env.GROQ_API_KEY);

    try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: 'You are a test assistant.' },
                    { role: 'user', content: 'Say hello!' }
                ],
                model: 'grok-beta',
                stream: false
            })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`API Error: ${response.status} ${text}`);
        }

        const data = await response.json();
        console.log("Success! Response:", data.choices[0].message.content);
    } catch (error) {
        console.error("FAILED:", error.message);
    }
}

testAI();
