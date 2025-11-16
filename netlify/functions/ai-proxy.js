
export default async (req) => {
    try {
        const { prompt } = await req.json();
        const HF_API_KEY = process.env.HF_API_KEY; // Gets the key from Netlify's secure storage

        if (!HF_API_KEY || HF_API_KEY === 'YOUR_HUGGING_FACE_API_KEY_GOES_HERE') {
            return new Response("API key is not configured on the server.", { status: 500 });
        }

        const API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${HF_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                inputs: prompt,
                parameters: { max_new_tokens: 300, temperature: 0.7, return_full_text: false }
            }),
        });

        if (!response.ok) {
            return new Response(`API request failed: ${await response.text()}`, { status: response.status });
        }

        return new Response(await response.blob(), { headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        return new Response(error.message, { status: 500 });
    }
};
