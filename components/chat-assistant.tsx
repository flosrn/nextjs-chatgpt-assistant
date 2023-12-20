'use client';

import {
  experimental_useAssistant as useAssistant,
  type Message
} from 'ai/react';

import { cn } from '@/lib/utils';
import { ChatPanel } from '@/components/chat-panel';
import { EmptyScreen } from '@/components/empty-screen';
import { BackButton } from '@/components/back-button';
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor';
import { ChatAssistantList } from '@/components/chat-assistant-list';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  threadId?: string;
}

const getChats = async (threadId?: string) => {
  console.log('threadId : ', threadId);
  const res = await fetch('/api/assistants/messages', {
    method: 'POST',
    body: JSON.stringify({ threadId }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await res.json();
  return data;
};

export function ChatAssistant({ threadId, className }: ChatProps) {
  const router = useRouter();
  const path = usePathname();
  const { data } = useQuery({
    queryKey: ['chats', threadId],
    queryFn: async () => await getChats(threadId)
  });
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  );
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW);
  const [previewTokenInput, setPreviewTokenInput] = useState(
    previewToken ?? ''
  );
  const { status, messages, input, submitMessage, handleInputChange, error } =
    useAssistant({
      api: '/api/assistant/messages/create',
      threadId,
      body: {
        threadId,
        previewToken
      }
    });

  const [inputValue, setInputValue] = useState(input);

  // When status changes to accepting messages, focus the input:
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (status === 'awaiting_message') {
      inputRef.current?.focus();
    }
  }, [status]);

  const allMessages = data ? [...data, ...messages] : data;

  // console.log('allMessages : ', allMessages);

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        <div className="mx-auto max-w-2xl px-4 mb-5">
          <BackButton className="md:-ml-12" />
        </div>
        {allMessages?.length ? (
          <>
            <ChatAssistantList
              messages={allMessages}
              isLoading={status === 'in_progress'}
            />
            <ChatScrollAnchor trackVisibility={status === 'in_progress'} />
          </>
        ) : (
          <EmptyScreen setInput={setInputValue} />
        )}
      </div>

      <ChatPanel
        id={threadId}
        isLoading={status === 'in_progress'}
        submitMessage={submitMessage}
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
      />

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput);
                setPreviewTokenDialog(false);
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
