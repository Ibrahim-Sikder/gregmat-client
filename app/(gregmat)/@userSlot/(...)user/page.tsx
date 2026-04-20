import { getCurrentUser } from "@/actions/user";
import { UserInfo } from "@/components/auth/UserInfo";

import UserInfoDialog from "@/components/auth/UserInfoDialog";

export default async function UserModal() {
  const user = await getCurrentUser();
  return (
    <>
      <UserInfoDialog>
        <UserInfo user={user} />
      </UserInfoDialog>
    </>
  );
}
