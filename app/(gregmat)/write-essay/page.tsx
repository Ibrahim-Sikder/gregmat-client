import {
  getAllDefaultPrompt,
  getAllUserPrompt,
  getAllUserSaved,
} from "@/actions/write-essay";
import WriteEssay from "@/components/pages/write-essay/WriteEssay";
import Container from "@/components/shared/container/Container";
import { useAppSelector } from "@/redux/hooks";

export default async function page() {
  const userPrompt = await getAllUserPrompt();
  const allSaved = await getAllUserSaved();

  return (
    <Container className="py-4 px-2 md:px-0">
      <WriteEssay userPrompt={userPrompt} allSaved={allSaved} />
    </Container>
  );
}
