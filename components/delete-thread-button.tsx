'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { IconTrash } from '@/components/ui/icons';
import { deleteThread } from '@/app/actions';

type DeleteThreadButtonProps = {
  threadId: string;
};

export function DeleteThreadButton({ threadId }: DeleteThreadButtonProps) {
  return (
    <Button variant="ghost" onClick={() => deleteThread(threadId)}>
      <IconTrash />
    </Button>
  );
}
