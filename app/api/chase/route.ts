import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { invoiceId } = await req.json();

    if (!invoiceId) {
      return Response.json({ error: "No invoice ID provided" }, { status: 400 });
    }

    console.log("Looking for invoice:", invoiceId);

    const { data: invoice, error } = await supabaseService
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (error || !invoice) {
      console.error("Invoice fetch error:", error);
      return Response.json({ error: "Invoice not found in database" }, { status: 404 });
    }

    // AI Agent Logic
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Write a short friendly payment reminder for this invoice:
Client: ${invoice.client_name}
Amount: ₹${invoice.amount}
Due: ${invoice.due_date}

Return ONLY JSON: {"subject": "...", "body": "..."}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const aiMessage = JSON.parse(text);

    // Send Email
    await resend.emails.send({
      from: 'AgentChase <hello@resend.dev>',
      to: invoice.client_email,
      subject: aiMessage.subject,
      html: aiMessage.body,
    });

    // Log it
    await supabaseService.from('chase_logs').insert({
      invoice_id: invoiceId,
      user_id: invoice.user_id,
      message_type: 'email',
      subject: aiMessage.subject,
      content: aiMessage.body,
      status: 'sent'
    });

    return Response.json({ success: true, message: "✅ AI Agent sent the chase email!" });

  } catch (err: any) {
    console.error("Chase Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
