'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  text?: string; 
}

export default function LoadingSpinner({ size = 24, text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-2">
      <Loader2 className="animate-spin text-gray-500" size={size} />
      {text && <span className="text-sm text-gray-500">{text}</span>}
    </div>
  );
}
