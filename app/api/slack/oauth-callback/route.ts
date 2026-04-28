import { NextResponse } from 'next/server';

const SLACK_INSTALLATIONS_DB_ID = '1264b4bc-583a-40d3-a8d6-df75de32f498';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  try {
    const response = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID!,
        client_secret: process.env.SLACK_CLIENT_SECRET!,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://baget-tracely.vercel.app'}/api/slack/oauth-callback`,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Slack OAuth Error:', data.error);
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    // Save to database
    await fetch(`https://stg-app.baget.ai/api/public/databases/${SLACK_INSTALLATIONS_DB_ID}/rows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          team_id: data.team.id,
          team_name: data.team.name,
          access_token: data.access_token,
          bot_user_id: data.bot_user_id,
          installed_at: new Date().toISOString(),
        },
        externalKey: data.team.id, // Ensure we update if re-installed
      }),
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://baget-tracely.vercel.app'}/?status=success`);
  } catch (err) {
    console.error('OAuth Callback Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
