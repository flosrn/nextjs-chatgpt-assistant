import OpenAI from 'openai';
import { IconArrowRight } from '@/components/ui/icons';
import { BackButton } from '@/components/back-button';
import Link from 'next/link';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

async function getAssistants() {
  const assistants = await openai.beta.assistants.list();
  return assistants.data;
}

export default async function AssistantsPage() {
  const assistants = await getAssistants();

  return (
    <div className="pb-[200px] pt-4 md:pt-10">
      <div className="mx-auto max-w-2xl px-4">
        <BackButton />
        <div className="rounded-lg border bg-background p-8">
          <h1 className="text-lg font-semibold">List of Assistants</h1>
          <p className="mt-2 leading-normal text-muted-foreground">
            {`Assistants are GPT-powered personalized assistant created using
          OpenAI's API that can perform a variety of tasks.`}
          </p>
          <p className="mt-2 leading-normal text-muted-foreground">
            There are {assistants.length} assistants available. Click on the
            assistant you want to use.
          </p>
          <div className="mt-4 flex flex-col items-start space-y-2">
            {assistants.map((assistant, index) => (
              <Link
                key={index}
                href={`/assistants/${assistant.id}`}
                className="h-auto p-0 text-base flex items-center"
              >
                <IconArrowRight className="mr-2 text-muted-foreground" />
                {assistant.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
