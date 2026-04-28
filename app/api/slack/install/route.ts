import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.SLACK_CLIENT_ID;
  const scopes = 'app_mentions:read,channels:history,chat:write,commands,groups:history,im:history,mpim:history';
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://baget-tracely.vercel.app'}/api/slack/oauth-callback`;
  
  const slackUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  return NextResponse.redirect(slackUrl);
}
