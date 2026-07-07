import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text || typeof text !== 'string') {
            return NextResponse.json(
                { error: 'Invalid or missing text field in request body.' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is not set.');
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text:
                                        "You are an expert civic assistant. The user will provide a complex government policy or scheme. Break it down into incredibly simple terms. Return ONLY a valid JSON object with exactly three string keys: 'whatIsIt' (1-2 sentences explaining the core purpose), 'eligibility' (1-2 sentences explaining who qualifies), and 'benefit' (1-2 sentences explaining what the user gets). Here is the policy: " +
                                        text,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API returned an error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            throw new Error('Invalid response format received from Gemini API.');
        }

        // Strip out potential markdown code block formatting (e.g., ```json\n...\n```)
        const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
        const parsedObject = JSON.parse(cleanedText);

        return NextResponse.json(parsedObject);
    } catch (error) {
        console.error('Error translating policy:', error);
        return NextResponse.json(
            { error: 'Failed to process the policy translation.' },
            { status: 500 }
        );
    }
}
