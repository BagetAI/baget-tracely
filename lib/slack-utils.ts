import crypto from 'crypto';

export function verifySlackRequest(req: Request, body: string) {
  const signature = req.headers.get('x-slack-signature');
  const timestamp = req.headers.get('x-slack-request-timestamp');
  const signingSecret = process.env.SLACK_SIGNING_SECRET;

  if (!signature || !timestamp || !signingSecret) return false;

  // Prevent replay attacks
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
  if (parseInt(timestamp) < fiveMinutesAgo) return false;

  const baseString = `v0:${timestamp}:${body}`;
  const hmac = crypto.createHmac('sha256', signingSecret);
  const mySignature = `v0:${hmac.update(baseString).digest('hex')}`;

  return crypto.timingSafeEqual(Buffer.from(mySignature), Buffer.from(signature));
}

export async function postToSlack(channel: string, text: string, blocks: any[], token: string) {
  return fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      channel,
      text,
      blocks
    })
  });
}
