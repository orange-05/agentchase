import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let imageBase64: string;
    let mimeType: string;

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload from dashboard
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return Response.json({ error: 'No file uploaded' }, { status: 400 });
      }

      mimeType = file.type || 'application/pdf';
      const arrayBuffer = await file.arrayBuffer();
      imageBase64 = Buffer.from(arrayBuffer).toString('base64');
    } else {
      // Legacy: JSON with imageUrl (base64 data URL)
      const { imageUrl, base64, mime } = await req.json();
      if (!imageUrl && !base64) {
        return Response.json({ error: 'No file or image provided' }, { status: 400 });
      }
      if (base64) {
        imageBase64 = base64;
        mimeType = mime || 'application/pdf';
      } else {
        // Parse data URL
        const match = (imageUrl as string).match(/^data:([^;]+);base64,(.+)$/);
        if (!match) {
          return Response.json({ error: 'Invalid image URL format' }, { status: 400 });
        }
        mimeType = match[1];
        imageBase64 = match[2];
      }
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt =
      'You are an expert invoice extractor. Extract ONLY these fields from the invoice as valid JSON: ' +
      '{"client_name": "string", "amount": number, "due_date": "YYYY-MM-DD", "client_email": "string or null"}. ' +
      'If a field is missing use null or empty string. Return ONLY the JSON, no markdown fences.';

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
    ]);

    const text = result.response.text().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);

    return Response.json(parsed);
  } catch (error: any) {
    console.error('Extraction error:', error);
    return Response.json(
      { error: 'Failed to extract invoice details. Please enter manually.' },
      { status: 500 }
    );
  }
}
