import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

export async function GET() {
  const threadId = process.env.THREAD_ID ?? '';

  const threadMessages = (
    await openai.beta.threads.messages.list(threadId, {
      order: 'asc',
      limit: 100
    })
  ).data;

  return Response.json(threadMessages);
}
