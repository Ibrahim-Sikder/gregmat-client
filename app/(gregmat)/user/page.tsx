import { getCurrentUser } from "@/actions/user";
import { UserInfo } from "@/components/auth/UserInfo";
import BgContainer from "@/components/shared/container/BgContainer";
import Container from "@/components/shared/container/Container";

export default async function page() {
  const user = await getCurrentUser();

  return (
    <>
      <BgContainer variant="minimal" className="py-10">
        <Container>
          <UserInfo user={user} />
        </Container>
      </BgContainer>
    </>
  );
}
