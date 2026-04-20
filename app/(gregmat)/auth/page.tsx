import Auth from '@/components/auth/Auth';
import BgContainer from '@/components/shared/container/BgContainer';
import Container from '@/components/shared/container/Container';
import React, { Suspense } from 'react';

const page = () => {
  return (
    <>
      <BgContainer variant="minimal" className="py-10">
        <Container className="px-2">
          <Suspense>
            <Auth />
          </Suspense>
        </Container>
      </BgContainer>
    </>
  );
};

export default page;
