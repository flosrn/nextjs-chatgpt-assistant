import { AssistantMessage, type Message } from 'ai';

import { Separator } from '@/components/ui/separator';
import { ChatMessage } from '@/components/chat-message';
import { cn } from '@/lib/utils';
import { IconOpenAI } from '@/components/ui/icons';

export interface ChatAssistantList {
  messages: AssistantMessage[] | Message[];
  isLoading?: boolean;
}

export function ChatAssistantList({ messages, isLoading }: ChatAssistantList) {
  if (!messages.length) {
    return null;
  }

  const transformedMessages = messages.map(message => {
    if (typeof message.content === 'string') {
      return message;
    }
    const contents = message.content.map(content => {
      if (content.type === 'text') {
        return content.text.value;
      }
      return '';
    });
    return {
      ...message,
      content: contents[0]
    };
  }) as Message[];

  // console.log('transformedMessages : ', transformedMessages);

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {transformedMessages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
          {(index < transformedMessages.length - 1 ||
            (isLoading && transformedMessages.length - 1 === index)) && (
            <Separator className="my-4 md:my-8" />
          )}
          {isLoading && transformedMessages.length - 1 === index && (
            <div className="group relative mb-4 flex items-start md:-ml-12">
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow bg-primary text-primary-foreground">
                <IconOpenAI />
              </div>
              <div className="h-8 w-full p-2 mb-8 bg-gray-300 ml-4 dark:bg-gray-600 rounded-lg animate-pulse" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
