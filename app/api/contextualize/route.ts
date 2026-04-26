import { NextResponse } from 'next/server';

const INCIDENT_DB_ID = 'c995bb97-b1c0-46d1-9416-c1faf6c5fb97';

/**
 * Tracely Contextualization API with Semantic Search
 */
export async function POST(req: Request) {
  try {
    const { stackTrace, language = 'unknown' } = await req.json();

    if (!stackTrace) {
      return NextResponse.json({ error: 'Field "stackTrace" is required.' }, { status: 400 });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // 1. Get embedding for the current error
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        input: stackTrace,
        model: 'text-embedding-3-small'
      })
    });

    const embeddingData = await embeddingResponse.json();
    const currentEmbedding = embeddingData.data[0].embedding;

    // 2. Fetch historical incidents from Baget Database
    const dbResponse = await fetch(`https://stg-app.baget.ai/api/public/databases/${INCIDENT_DB_ID}/rows`);
    const { rows } = await dbResponse.json();

    // 3. Find the most similar past incident
    // Since we don't store embeddings in the DB yet (to avoid overhead),
    // we use GPT-4o-mini to do a final "Contextual Match" across the history
    // while the embeddings can be used for initial filtering in a larger system.
    // For this prototype, we'll use GPT to select the most relevant incident from the retrieved history.
    
    const matchingPrompt = `
      You are an expert SRE. Given a new stack trace and a list of historical incidents, identify the MOST SIMILAR past incident.
      If a match is found, explain WHY it is similar and what the team learned.

      NEW ERROR:
      ${stackTrace}

      PAST INCIDENTS:
      ${JSON.stringify(rows, null, 2)}

      Response MUST be a JSON object:
      {
        "hasMatch": boolean,
        "matchedIncident": object | null,
        "matchReason": string,
        "resolution": string
      }
    `;

    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: matchingPrompt }],
        response_format: { type: 'json_object' }
      })
    });

    const gptData = await gptResponse.json();
    const matchResult = JSON.parse(gptData.choices[0].message.content);

    // 4. Generate the full contextual response
    const analysisPrompt = `
      Analyze this error: ${stackTrace}
      Language: ${language}
      Similar Past Incident: ${matchResult.hasMatch ? matchResult.matchReason : 'None found.'}

      Provide:
      - summary (concise explanation)
      - likelyCause (technical root cause)
      - suggestedFix (actionable code change)
    `;

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: analysisPrompt }],
        response_format: { type: 'json_object' }
      })
    });

    const analysisData = await analysisResponse.json();
    const finalAnalysis = JSON.parse(analysisData.choices[0].message.content);

    return NextResponse.json({
      ...finalAnalysis,
      similarIncident: matchResult.hasMatch ? {
        author: matchResult.matchedIncident.author,
        date: matchResult.matchedIncident.fix_date,
        resolution: matchResult.matchedIncident.resolution,
        context: matchResult.matchReason
      } : null
    });

  } catch (err) {
    console.error('Semantic Search Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
