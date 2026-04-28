import { NextResponse } from 'next/server';
import { analyzeStackTrace } from '@/lib/tracely-engine';

export async function POST(req: Request) {
  try {
    const { stackTrace, language = 'unknown' } = await req.json();

    if (!stackTrace) {
      return NextResponse.json({ error: 'Field "stackTrace" is required.' }, { status: 400 });
    }

    const analysis = await analyzeStackTrace(stackTrace, language);

    return NextResponse.json({
      ...analysis,
      similarIncident: analysis.hasMatch ? {
        author: analysis.matchedIncident.author,
        date: analysis.matchedIncident.date,
        resolution: analysis.matchedIncident.resolution,
        context: analysis.matchReason
      } : null
    });

  } catch (err) {
    console.error('Semantic Search Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
