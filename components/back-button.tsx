'use client';

import React from 'react';
import { IconArrowLeft } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type BackButtonProps = {
  className?: string;
};

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();
  return (
    <Button
      variant="link"
      onClick={() => router.back()}
      className={cn('pl-0', className)}
    >
      <IconArrowLeft className="mr-2 text-muted-foreground" />
      Back
    </Button>
  );
}
