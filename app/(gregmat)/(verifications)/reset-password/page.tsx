import Container from "@/components/shared/container/Container";
import ResetForm from "@/components/shared/forms/ResetForm";

interface RestPasswordProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: RestPasswordProps) {
  const resolvedSearchParams = await searchParams;
  const token = (resolvedSearchParams?.token as string | undefined) ?? "";

  return (
    <Container className="px-2">
      <ResetForm token={token} />
    </Container>
  );
}
