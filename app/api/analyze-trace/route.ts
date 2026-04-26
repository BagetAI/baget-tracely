import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { error, stackTrace } = await req.json();

    if (!error || !stackTrace) {
      return NextResponse.json({ error: 'Missing error or stackTrace' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const prompt = `
      You are an expert AI Engineer at Tracely. 
      Analyze the following error and stack trace and provide:
      1. A human-friendly explanation of what happened.
      2. A suggested code fix.
      3. A potential root cause based on common architectural patterns.

      Error: ${error}
      Stack Trace: ${stackTrace}

      Format the response as a JSON object with:
      - explanation (string)
      - suggestion (string)
      - rootCause (string)
      - slackBlocks (array of Slack Block Kit objects)
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(result);
  } catch (err) {
    console.error('Error analyzing trace:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
