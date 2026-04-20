import { getCurrentUser } from "@/actions/user";
import Start from "@/components/quiz/Start";
import Container from "@/components/shared/container/Container";
import fetchWrapper from "@/lib/fetchWrapper";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: Props) {
  const search = await searchParams;

  const id = Array.isArray(search.c) ? search.c[0] : search.c ?? null;

  let apiData: any = { success: false, data: [] };

  try {
    const res = await fetchWrapper(`/super-quiz/my-quiz`, {
      cache: "no-store",
    });
    apiData = res?.data;
  } catch (error) {}

  const user = await getCurrentUser();
  const isSuper = true;

  return (
    <Container className="bg-gray-400">
      <Start data={apiData} user={user} search={id} isSuper={isSuper} />
    </Container>
  );
}
