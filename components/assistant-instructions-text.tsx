'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

type AssistantInstructionsTextProps = { text?: string | null };

export function AssistantInstructionsText({
  text
}: AssistantInstructionsTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <p
        className={cn('mt-2 leading-normal text-muted-foreground', {
          'line-clamp-3': !isExpanded
        })}
      >
        <strong>Instructions:</strong> {text}
      </p>
      {text && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-muted-foreground hover:underline"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </>
  );
}
