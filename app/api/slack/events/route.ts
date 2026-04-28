import { NextResponse } from 'next/server';
import { verifySlackRequest, postToSlack } from '@/lib/slack-utils';
import { analyzeStackTrace } from '@/lib/tracely-engine';

const SLACK_INSTALLATIONS_DB_ID = '1264b4bc-583a-40d3-a8d6-df75de32f498';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const body = JSON.parse(rawBody);

  // 1. Handle URL Verification
  if (body.type === 'url_verification') {
    return NextResponse.json({ challenge: body.challenge });
  }

  // 2. Verify Request (Disabled for initial test if secret not set, but recommended)
  // if (!verifySlackRequest(req, rawBody)) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  // 3. Handle Events
  if (body.event) {
    const { type, text, channel, user, bot_id, thread_ts } = body.event;

    // Ignore bot messages to prevent loops
    if (bot_id) return NextResponse.json({ ok: true });

    // Look for stack trace patterns (e.g., "Error: " or "at ...")
    const isStackTrace = text.includes('Error') || text.includes('at ') || text.includes('Exception');

    if (isStackTrace) {
      try {
        // Get the token for this team
        const dbResponse = await fetch(`https://stg-app.baget.ai/api/public/databases/${SLACK_INSTALLATIONS_DB_ID}/rows`);
        const { rows } = await dbResponse.json();
        const installation = rows.find((r: any) => r.team_id === body.team_id);

        if (!installation) {
          console.error('No installation found for team:', body.team_id);
          return NextResponse.json({ ok: true });
        }

        const token = installation.access_token;

        // Start analysis
        const analysis = await analyzeStackTrace(text);

        // Build Slack Block Response
        const blocks = [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Tracely Contextual Analysis* \n ${analysis.summary}`
            }
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Likely Cause:*\n${analysis.likelyCause}` },
              { type: 'mrkdwn', text: `*Suggested Fix:*\n${analysis.suggestedFix}` }
            ]
          }
        ];

        if (analysis.hasMatch) {
          blocks.push({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `:magic_wand: *Institutional Memory Match:*\n${analysis.matchReason}\n_Resolved by ${analysis.matchedIncident.author} on ${analysis.matchedIncident.date}_`
            }
          });
        }

        blocks.push({
          type: 'context',
          elements: [{ type: 'mrkdwn', text: 'Heritage Performance Engine | Tracely 2026' }]
        });

        await postToSlack(channel, 'Tracely Analysis', blocks, token);

      } catch (err) {
        console.error('Slack Event Processing Error:', err);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
