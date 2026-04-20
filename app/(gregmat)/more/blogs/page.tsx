import Blogs from '@/components/pages/blogs/Blogs';
import Container from '@/components/shared/container/Container';
import React from 'react';

export default function page() {
  return (
    <>
      <Container className="px-2">
        <Blogs />
      </Container>
    </>
  );
}
