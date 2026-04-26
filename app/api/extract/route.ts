import { GoogleGenerativeAI } from '@google/generative-ai';

 codex/deploy-project-to-netlify-with-landing-page-qbktyk
type InvoiceExtraction = {
  client_name: string;
  amount: string;
  due_date: string;
  client_email: string;
=======
type ExtractPayload = {
  imageUrl?: string;
 main
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
}
 codex/deploy-project-to-netlify-with-landing-page-qbktyk

function toBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString('base64');
}

function extractJsonObject(text: string): InvoiceExtraction {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('AI did not return valid JSON');
  }

  const parsed = JSON.parse(cleaned.slice(start, end + 1)) as Partial<InvoiceExtraction>;

  return {
    client_name: parsed.client_name ?? '',
    amount: parsed.amount ? String(parsed.amount) : '',
    due_date: parsed.due_date ?? '',
    client_email: parsed.client_email ?? '',
  };
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
=======

export async function POST(req: Request) {
  try {
    const { imageUrl }: ExtractPayload = await req.json();
 main

    if (!(file instanceof File)) {
      return Response.json({ error: 'Invoice file is required' }, { status: 400 });
    }

 codex/deploy-project-to-netlify-with-landing-page-qbktyk
    const bytes = await file.arrayBuffer();
=======
 main
    const genAI = new GoogleGenerativeAI(getRequiredEnv('GEMINI_API_KEY'));
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt =
 codex/deploy-project-to-netlify-with-landing-page-qbktyk
      'Extract ONLY this JSON from the provided invoice: {"client_name":"","amount":"","due_date":"YYYY-MM-DD","client_email":""}. Use empty strings when unavailable. Respond with JSON only.';

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data: toBase64(bytes),
          mimeType: file.type || 'application/pdf',
        },
      },
=======
      'You are an expert invoice extractor. Extract ONLY these fields from the invoice PDF/image as valid JSON: {"client_name": "string", "amount": number, "due_date": "YYYY-MM-DD", "client_email": "string or null"}. If field is missing, use null or empty string.';

    const result = await model.generateContent([
      prompt,
      { fileData: { fileUri: imageUrl, mimeType: 'application/pdf' } },
 main
    ]);

    const parsed = extractJsonObject(result.response.text());
    return Response.json(parsed);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to extract invoice details. Please enter manually.';

    return Response.json({ error: message }, { status: 500 });
  }
}
