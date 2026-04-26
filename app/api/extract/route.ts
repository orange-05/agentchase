import { GoogleGenerativeAI } from '@google/generative-ai';

type ExtractPayload = {
  imageUrl?: string;
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
    const { imageUrl }: ExtractPayload = await req.json();

    if (!imageUrl) {
      return Response.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(getRequiredEnv('GEMINI_API_KEY'));
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt =
      'You are an expert invoice extractor. Extract ONLY these fields from the invoice PDF/image as valid JSON: {"client_name": "string", "amount": number, "due_date": "YYYY-MM-DD", "client_email": "string or null"}. If field is missing, use null or empty string.';

    const result = await model.generateContent([
      prompt,
      { fileData: { fileUri: imageUrl, mimeType: 'application/pdf' } },
    ]);

    const text = result.response.text().replace(/`json|`/g, '').trim();
    const parsed = JSON.parse(text);

    return Response.json(parsed);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to extract invoice details. Please enter manually.';

    return Response.json({ error: message }, { status: 500 });
  }
}
