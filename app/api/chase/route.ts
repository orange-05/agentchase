import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

type ChasePayload = {
  invoiceId?: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
}

export async function POST(req: Request) {
  try {
    const { invoiceId }: ChasePayload = await req.json();

    if (!invoiceId) {
      return Response.json({ error: 'No invoice ID provided' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(getRequiredEnv('GEMINI_API_KEY'));
    const resend = new Resend(getRequiredEnv('RESEND_API_KEY'));
    const supabaseService = createClient(
      getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
      getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY')
    );

    const { data: invoice, error } = await supabaseService
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (error || !invoice) {
      return Response.json({ error: 'Invoice not found in database' }, { status: 404 });
    }

 codex/deploy-project-to-netlify-with-landing-page-det6un
=======
 codex/deploy-project-to-netlify-with-landing-page-ruwyj5
=======
 codex/deploy-project-to-netlify-with-landing-page-qbktyk
 main
 main
    if (!invoice.client_email) {
      return Response.json({ error: 'Client email is missing for this invoice' }, { status: 400 });
    }

 codex/deploy-project-to-netlify-with-landing-page-det6un
=======
 codex/deploy-project-to-netlify-with-landing-page-ruwyj5
=======
=======
 main
 main
 main
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `Write a short friendly payment reminder for this invoice:
Client: ${invoice.client_name}
Amount: ₹${invoice.amount}
Due: ${invoice.due_date}

Return ONLY JSON: {"subject": "...", "body": "..."}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const aiMessage = JSON.parse(text) as { subject: string; body: string };

    await resend.emails.send({
      from: 'AgentChase <hello@resend.dev>',
      to: invoice.client_email,
      subject: aiMessage.subject,
      html: aiMessage.body,
    });

    await supabaseService.from('chase_logs').insert({
      invoice_id: invoiceId,
      user_id: invoice.user_id,
      message_type: 'email',
      subject: aiMessage.subject,
      content: aiMessage.body,
      status: 'sent',
    });

    return Response.json({ success: true, message: '✅ AI Agent sent the chase email!' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return Response.json({ error: message }, { status: 500 });
  }
}
