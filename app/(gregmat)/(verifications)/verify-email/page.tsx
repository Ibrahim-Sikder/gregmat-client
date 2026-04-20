import VerifyEmail from "@/components/auth/VerifyEmail";
import Container from "@/components/shared/container/Container";

interface VerifyEmailProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: VerifyEmailProps) {
  const resolvedSearchParams = await searchParams;
  const token = (resolvedSearchParams?.token as string | undefined) ?? "";
  const email = (resolvedSearchParams?.email as string | undefined) ?? "";
  return (
    <Container className="px-2">
      <VerifyEmail token={token} email={email} />
    </Container>
  );
}
