import openai from '@/lib/openai';

export async function GET() {
  // Get all assistants
  const assistants = await openai.beta.assistants.list();

  return Response.json(assistants);
}
