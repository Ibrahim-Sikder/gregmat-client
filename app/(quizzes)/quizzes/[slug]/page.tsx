import { getCurrentUser } from "@/actions/user";
import StartContainer from "@/components/quiz/StartContainer";
import Container from "@/components/shared/container/Container";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const search = await searchParams;
  const id = Array.isArray(search.c) ? search.c[0] : (search.c ?? null);
  const user = await getCurrentUser();

  return (
    <Container className="bg-gray-400">
      <StartContainer slug={slug} user={user} id={id} />
    </Container>
  );
}
