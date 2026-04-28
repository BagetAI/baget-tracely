import { NextResponse } from 'next/server';
import { analyzeStackTrace } from '@/lib/tracely-engine';

export async function POST(req: Request) {
  try {
    const { error, stackTrace } = await req.json();

    if (!error || !stackTrace) {
      return NextResponse.json({ error: 'Missing error or stackTrace' }, { status: 400 });
    }

    const result = await analyzeStackTrace(`${error}\n${stackTrace}`);

    return NextResponse.json(result);
  } catch (err) {
    console.error('Error analyzing trace:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
