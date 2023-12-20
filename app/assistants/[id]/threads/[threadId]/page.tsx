import { ChatAssistant } from '@/components/chat-assistant';

type ThreadPageProps = {
  params: {
    id: string;
    threadId: string;
  };
};

export default function ThreadPage({ params }: ThreadPageProps) {
  return <ChatAssistant threadId={params.threadId} />;
}
