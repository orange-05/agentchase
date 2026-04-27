import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    // ── Validate env var ─────────────────────────────────────────────────────
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: 'GEMINI_API_KEY is not configured. Please set it in Netlify → Site Settings → Environment Variables.' },
        { status: 500 }
      );
    }

    // ── Parse the uploaded file ───────────────────────────────────────────────
    const contentType = req.headers.get('content-type') || '';

    let imageBase64: string;
    let mimeType: string;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return Response.json({ error: 'No file uploaded' }, { status: 400 });
      }

      mimeType = file.type || 'image/jpeg';
      const arrayBuffer = await file.arrayBuffer();
      imageBase64 = Buffer.from(arrayBuffer).toString('base64');
    } else {
      // Legacy JSON body support
      const body = await req.json().catch(() => ({}));
      const { imageUrl, base64, mime } = body;

      if (!imageUrl && !base64) {
        return Response.json({ error: 'No file or image provided' }, { status: 400 });
      }

      if (base64) {
        imageBase64 = base64;
        mimeType = mime || 'image/jpeg';
      } else {
        const match = (imageUrl as string).match(/^data:([^;]+);base64,(.+)$/);
        if (!match) {
          return Response.json({ error: 'Invalid image URL format' }, { status: 400 });
        }
        mimeType = match[1];
        imageBase64 = match[2];
      }
    }

    // ── Call Gemini ───────────────────────────────────────────────────────────
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt =
      'You are an expert invoice data extractor. Look at this invoice document carefully. ' +
      'Extract ONLY these fields and return them as a valid JSON object: ' +
      '{"client_name": "string", "amount": number, "due_date": "YYYY-MM-DD or null", "client_email": "string or null"}. ' +
      'Rules: amount must be a plain number (no currency symbols). ' +
      'due_date must be in YYYY-MM-DD format or null if not found. ' +
      'client_email must be a valid email or null. ' +
      'Return ONLY the raw JSON — no markdown, no explanation, no extra text.';

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType, data: imageBase64 } },
    ]);

    const rawText = result.response.text().trim();

    // Strip markdown fences if present
    const cleanText = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    let parsed: Record<string, any>;
    try {
      parsed = JSON.parse(cleanText);
    } catch {
      // Try to extract JSON from the text if it's embedded
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        console.error('Could not parse AI response:', cleanText);
        return Response.json(
          { error: 'AI could not extract details from this file. Please fill in manually.' },
          { status: 422 }
        );
      }
    }

    // Sanitize the parsed result
    const sanitized = {
      client_name: String(parsed.client_name || '').trim(),
      amount: Number(parsed.amount) || 0,
      due_date: parsed.due_date && parsed.due_date !== 'null' ? String(parsed.due_date) : '',
      client_email: parsed.client_email && parsed.client_email !== 'null' ? String(parsed.client_email).trim() : '',
    };

    return Response.json(sanitized);

  } catch (error: any) {
    console.error('Extraction error:', error?.message || error);
    return Response.json(
      { error: `Extraction failed: ${error?.message || 'Unknown error'}. Please fill in manually.` },
      { status: 500 }
    );
  }
}
