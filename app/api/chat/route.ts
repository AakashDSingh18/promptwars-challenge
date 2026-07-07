import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY?.trim()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "You are Smart Bharat, an official AI civic companion. Keep answers under 3 sentences. Be extremely helpful. If the user speaks in Hindi or Hinglish, reply in the same language. User says: " + message
              }
            ]
          }
        ]
      }),
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
