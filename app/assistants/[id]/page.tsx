import OpenAI from 'openai';
import { cn } from '@/lib/utils';
import { auth } from '@/auth';
import { BackButton } from '@/components/back-button';
import { ThreadList } from '@/components/thread-list';
import { Suspense } from 'react';
import { SimpleLinesSkeleton } from '@/components/skeletons';
import { AssistantInstructionsText } from '@/components/assistant-instructions-text';

type AssistantPageProps = {
  params: {
    id: string;
  };
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

async function getAssistant(id: string) {
  return openai.beta.assistants.retrieve(id);
}

export default async function AssistantPage({ params }: AssistantPageProps) {
  const session = await auth();

  if (!session?.user) {
    return {};
  }

  const assistant = await getAssistant(params.id);

  return (
    <div className={cn('pb-[200px] pt-4 md:pt-10')}>
      <div className="mx-auto max-w-2xl px-4">
        <BackButton />
        <div className="rounded-lg border bg-background p-8">
          <h1 className="text-lg font-semibold">{assistant.name}</h1>
          <p className="mt-2 leading-normal text-muted-foreground">
            <strong>Description:</strong> {assistant.description ?? 'None'}
          </p>
          <AssistantInstructionsText text={assistant.instructions} />
          <p className="mt-2 leading-normal text-muted-foreground">
            <strong>Model:</strong> {assistant.model}
          </p>
          <p className="mt-2 leading-normal text-muted-foreground">
            <strong>Threads:</strong>
          </p>
          <Suspense fallback={<SimpleLinesSkeleton />}>
            <ThreadList assistantId={params.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
