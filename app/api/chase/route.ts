import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    // ── Validate env vars upfront ────────────────────────────────────────────
    const missingVars: string[] = [];
    if (!process.env.GEMINI_API_KEY) missingVars.push('GEMINI_API_KEY');
    if (!process.env.RESEND_API_KEY) missingVars.push('RESEND_API_KEY');
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');

    if (missingVars.length > 0) {
      return Response.json(
        { error: `Missing environment variables: ${missingVars.join(', ')}. Please set them in Netlify → Site Settings → Environment Variables.` },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const supabaseService = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ── Parse request ────────────────────────────────────────────────────────
    const body = await req.json().catch(() => ({}));
    const { invoiceId } = body;

    if (!invoiceId) {
      return Response.json({ error: 'No invoice ID provided' }, { status: 400 });
    }

    // ── Fetch invoice ────────────────────────────────────────────────────────
    const { data: invoice, error: fetchError } = await supabaseService
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (fetchError || !invoice) {
      console.error('Invoice fetch error:', fetchError);
      return Response.json({ error: 'Invoice not found in database' }, { status: 404 });
    }

    // ── Validate client email ────────────────────────────────────────────────
    if (!invoice.client_email || !invoice.client_email.includes('@')) {
      return Response.json(
        { error: `No valid email for client "${invoice.client_name}". Please edit the invoice and add a client email before chasing.` },
        { status: 400 }
      );
    }

    // ── Generate AI message (with fallback if quota exceeded) ───────────────
    let aiMessage: { subject: string; body: string };

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `Write a short, professional but friendly payment reminder email for this invoice.
Client: ${invoice.client_name}
Amount: ₹${invoice.amount}
Due Date: ${invoice.due_date || 'as agreed'}

Return ONLY valid JSON (no markdown, no extra text):
{"subject": "...", "body": "..."}

The body should be plain text, 3-4 sentences max, polite but firm.`;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text().trim();

      // Strip markdown code fences if present
      const cleanText = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      aiMessage = JSON.parse(cleanText);
    } catch (aiErr: any) {
      // Fallback to a professional template when AI is unavailable (quota, network, parse error)
      console.warn('AI generation failed, using template fallback:', aiErr?.message);
      const duePart = invoice.due_date ? ` was due on ${invoice.due_date}` : ' is now due';
      aiMessage = {
        subject: `Payment Reminder — ₹${invoice.amount} Due`,
        body: `Hi ${invoice.client_name},\n\nI hope this message finds you well. This is a friendly reminder that your payment of ₹${invoice.amount}${duePart}.\n\nCould you please arrange the payment at your earliest convenience? If you've already sent it, please disregard this message.\n\nThank you for your prompt attention to this matter!\n\nBest regards`
      };
    }

    // ── Send email via Resend ────────────────────────────────────────────────
    const emailHtml = `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
        <h2 style="color:#1d4ed8">AgentChase Payment Reminder</h2>
        <div style="white-space:pre-line;color:#333;line-height:1.6">${aiMessage.body}</div>
        <hr style="margin:24px 0;border-color:#eee">
        <p style="color:#999;font-size:12px">Sent by AgentChase • AI-powered payment reminders</p>
      </div>`;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'AgentChase <onboarding@resend.dev>',
      to: invoice.client_email,
      subject: aiMessage.subject,
      html: emailHtml
    });

    // If Resend free tier blocks sending to unverified emails, retry to the user's own email
    if (emailError) {
      console.warn('Resend direct send failed:', emailError.message);

      // Get the user's own email from Supabase auth
      const { data: userData } = await supabaseService.auth.admin.getUserById(invoice.user_id);
      const userEmail = userData?.user?.email;

      if (userEmail) {
        const { data: retryData, error: retryError } = await resend.emails.send({
          from: 'AgentChase <onboarding@resend.dev>',
          to: userEmail,
          subject: `[Forward to ${invoice.client_name}] ${aiMessage.subject}`,
          html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
            <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#92400e">
              <strong>📋 Resend Free Tier:</strong> This email was intended for <strong>${invoice.client_email}</strong> but was delivered to you instead. Please forward it to your client, or <a href="https://resend.com/domains" style="color:#1d4ed8">verify a custom domain</a> to send directly.
            </div>
            ${emailHtml}
          </div>`
        });

        if (retryError) {
          console.error('Resend retry also failed:', retryError.message);
          return Response.json(
            { error: `Email delivery failed. Please verify your email at resend.com/audiences or add a custom domain at resend.com/domains.` },
            { status: 500 }
          );
        }

        // Log and return success with forwarding note
        await supabaseService.from('chase_logs').insert({
          invoice_id: invoiceId, user_id: invoice.user_id,
          message_type: 'email', subject: aiMessage.subject,
          content: aiMessage.body, status: 'sent_to_self'
        }).then(({ error }) => {
          if (error) console.warn('Chase log insert failed (non-critical):', error.message);
        });

        return Response.json({
          success: true,
          message: `✅ Chase email sent to your inbox (${userEmail}). Forward it to ${invoice.client_email}. Tip: Add a custom domain on Resend to send directly to clients.`,
          emailId: retryData?.id
        });
      }

      return Response.json(
        { error: `Email failed: Resend free tier can only send to verified emails. Verify your domain at resend.com/domains.` },
        { status: 500 }
      );
    }

    // ── Log the chase ────────────────────────────────────────────────────────
    await supabaseService.from('chase_logs').insert({
      invoice_id: invoiceId,
      user_id: invoice.user_id,
      message_type: 'email',
      subject: aiMessage.subject,
      content: aiMessage.body,
      status: 'sent'
    }).then(({ error }) => {
      if (error) console.warn('Chase log insert failed (non-critical):', error.message);
    });

    return Response.json({
      success: true,
      message: `✅ Chase email sent to ${invoice.client_email}`,
      emailId: emailData?.id
    });

  } catch (err: any) {
    console.error('Chase Error:', err);
    return Response.json(
      { error: err?.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
