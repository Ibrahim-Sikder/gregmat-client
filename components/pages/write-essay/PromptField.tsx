'use client';

import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import LoadingSpinner from '@/utils/LoadingSpinner';

export default function PromptField() {
  const { prompt, isLoading } = useAppSelector((state) => state.writingEssay);

  if (isLoading) {
    return <LoadingSpinner text="Loading prompt..." />;
  }

  if (!prompt) {
    return <p className="text-sm text-gray-500">No prompt selected.</p>;
  }

  return (
    <div className="p-4 bg-white border rounded-md">
      <p className="text-sm text-gray-800 leading-relaxed">{prompt.body}</p>
    </div>
  );
}
