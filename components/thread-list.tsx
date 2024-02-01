/**
 * =============================================================================
 * Thread List Component
 *
 * This component provides a temporary solution for listing threads associated
 * with a specific assistant.
 *
 * IMPORTANT: Don't forget to set your OpenAI Session key in .env.local
 * =============================================================================
 */
import React from 'react'
import Link from 'next/link'
import { IconArrowRight } from '@/components/ui/icons'
import { Run } from 'openai/resources/beta/threads'
import { Thread } from 'openai/resources/beta'
import { DeleteThreadButton } from '@/components/delete-thread-button'

type ThreadListProps = {
  assistantId: string
}

async function getThreads() {
  const response = await fetch('https://api.openai.com/v1/threads', {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_SESSION_KEY || ''}`,
      'OpenAI-Beta': 'assistants=v1'
    }
  })
  const { data } = await response.json()
  return data
}

export async function ThreadList({ assistantId }: ThreadListProps) {
  const threads: Thread[] = await getThreads()

  if (!threads) return null

  // get all runs for each thread
  const runsPromises = threads.map(async thread => {
    return fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY || ''}`,
        'OpenAI-Beta': 'assistants=v1'
      }
    })
      .then(response => response.json())
      .then(({ data }) => data)
  })

  const runs: Run[] = await Promise.all(runsPromises)

  // filter runs for this assistant
  const assistantRuns = runs
    .flat()
    .filter(run => run.assistant_id === assistantId)
  const assistantThreads = threads.filter(thread => {
    return assistantRuns.some(run => run.thread_id === thread.id)
  })

  return (
    <div className="mt-2 flex flex-col items-start space-y-2">
      {assistantThreads.map((thread, index) => (
        <div
          key={index}
          className="h-auto p-0 text-base w-full flex items-center justify-between"
        >
          <div className="flex items-center">
            <IconArrowRight className="mr-2 text-muted-foreground" />
            <Link
              key={index}
              href={`/assistants/${assistantId}/threads/${thread.id}`}
              className="hover:underline"
            >
              {thread.id}
            </Link>
          </div>
          <DeleteThreadButton threadId={thread.id} />
        </div>
      ))}
    </div>
  )
}
