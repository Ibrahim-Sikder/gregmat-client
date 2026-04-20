import ViewDetails from '@/components/pages/blogs/ViewDetails';
import Container from '@/components/shared/container/Container';
import React from 'react';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  return (
    <Container className="px-2">
      <ViewDetails slug={slug} />
    </Container>
  );
}
