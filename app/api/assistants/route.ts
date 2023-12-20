import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

export async function GET() {
  // Get all assistants
  const assistants = await openai.beta.assistants.list();

  return Response.json(assistants);
}
