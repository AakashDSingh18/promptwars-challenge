import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { base64Image, mimeType } = await req.json();
        const rawBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
        // console.log('rawBase64:', rawBase64);
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY?.trim()}`;

        console.log('Hitting URL:', apiUrl.replace(process.env.GEMINI_API_KEY?.trim() || '', '[HIDDEN_KEY]'));

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: "You are an expert civic assistant. Analyze this image of a public issue (e.g., pothole, broken streetlight). Return a JSON object with three keys: 'category' (short string), 'severity' (Low, Medium, High), and 'formalDraft' (a short, formal 3-sentence complaint addressed to the municipal corporation).",
                            },
                            {
                                inlineData: {
                                    mimeType: mimeType,
                                    data: rawBase64,
                                },
                            },
                        ],
                    },
                ],
            }),
        });

        if (!response.ok) {
            // This forces Next.js to read Google's exact error message
            const errorDetails = await response.text();

            console.error('\n🚨 GOOGLE API ERROR DETAILS 🚨');
            console.error(errorDetails);
            console.error('🚨 ========================== 🚨\n');

            throw new Error(`Gemini API error! status: ${response.status}`);
        }

        const data = await response.json();
        let text = data.candidates[0].content.parts[0].text;

        text = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

        return NextResponse.json({ result: text });
    } catch (error) {
        console.error('Error analyzing issue:', error);
        console.error(error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
