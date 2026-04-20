'use client';

import { format } from 'date-fns';

interface PracticeTestData {
  _id: string;
  title: string;
  tagline: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  data: PracticeTestData;
}

export default function PracticeTest({ data }: Props) {
  if (!data) return <p className="text-gray-500">No test data found.</p>;

  const { title, tagline, description, createdAt, updatedAt } = data;

  return (
    <section className="py-8">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-lg text-gray-600">{tagline}</p>
      </header>
      <article
        className="prose prose-blue max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </section>
  );
}
