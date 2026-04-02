const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') ?? 'Cloude Remote <onboarding@resend.dev>';

const html = (email: string) => `
  <div style="margin:0;padding:0;background:#0a0a0f;color:#faf8f5;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:48px 24px;">
      <div style="border:1px solid rgba(255,255,255,0.08);border-radius:24px;background:rgba(255,255,255,0.03);padding:40px;">
        <p style="margin:0 0 16px;font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#c9a84c;">
          Cloude Remote
        </p>
        <h1 style="margin:0 0 16px;font-size:32px;line-height:1.1;">You are on the waitlist.</h1>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:rgba(250,248,245,0.78);">
          Thanks for signing up with <strong>${email}</strong>. We will keep you posted as soon as access opens.
        </p>
        <div style="padding:18px 20px;border-radius:16px;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);">
          <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(250,248,245,0.86);">
            Your signup is confirmed. We will only send you important launch updates.
          </p>
        </div>
      </div>
    </div>
  </div>
`;

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers: CORS_HEADERS });
  }

  if (!RESEND_API_KEY) {
    return Response.json(
      { error: 'RESEND_API_KEY is not configured.' },
      { status: 500, headers: CORS_HEADERS },
    );
  }

  const payload = await request.json().catch(() => null);
  const email = typeof payload?.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailPattern.test(email)) {
    return Response.json({ error: 'Please provide a valid email address.' }, { status: 400, headers: CORS_HEADERS });
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: email,
      subject: 'You are on the Cloude Remote waitlist',
      html: html(email),
    }),
  });

  if (!resendResponse.ok) {
    const details = await resendResponse.text();
    console.error('Resend error:', details);
    return Response.json(
      { error: 'Email service is not configured yet.' },
      { status: 502, headers: CORS_HEADERS },
    );
  }

  return Response.json(
    { message: 'Confirmation email sent.' },
    { status: 200, headers: CORS_HEADERS },
  );
});
