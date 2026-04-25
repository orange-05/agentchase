import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return Response.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = 'You are an expert invoice extractor. Extract ONLY these fields from the invoice PDF/image as valid JSON: {"client_name": "string", "amount": number, "due_date": "YYYY-MM-DD", "client_email": "string or null"}. If field is missing, use null or empty string.';

    const result = await model.generateContent([
      prompt,
      { fileData: { fileUri: imageUrl, mimeType: 'application/pdf' } }
    ]);

    const text = result.response.text().replace(/`json|`/g, '').trim();
    const parsed = JSON.parse(text);

    return Response.json(parsed);
  } catch (error: any) {
    console.error('Extraction error:', error);
    return Response.json({ 
      error: 'Failed to extract invoice details. Please enter manually.' 
    }, { status: 500 });
  }
}
