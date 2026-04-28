const INCIDENT_DB_ID = 'c995bb97-b1c0-46d1-9416-c1faf6c5fb97';

export async function analyzeStackTrace(stackTrace: string, language: string = 'unknown') {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) throw new Error('OpenAI API key not configured');

  // 1. Fetch historical incidents from Baget Database
  const dbResponse = await fetch(`https://stg-app.baget.ai/api/public/databases/${INCIDENT_DB_ID}/rows`);
  const { rows } = await dbResponse.json();

  // 2. Identify similarity and analyze
  const prompt = `
    You are Tracely, an expert AI Engineer. 
    Analyze the following error/stack trace and check if it matches any historical incidents provided.

    NEW ERROR:
    ${stackTrace}

    PAST INCIDENTS:
    ${JSON.stringify(rows, null, 2)}

    Response MUST be a JSON object:
    {
      "summary": "concise explanation",
      "likelyCause": "technical root cause",
      "suggestedFix": "actionable code change",
      "hasMatch": boolean,
      "matchReason": "Why it matches a past incident (if applicable)",
      "matchedIncident": { "author": "...", "date": "...", "resolution": "..." } or null
    }
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
