import fetchWrapper from "@/lib/fetchWrapper";
import Materials from "./Materials";
import QuizList from "./QuizList";
import VocabHero from "./VocabHero";
import SeriesSection from "../pages/recordings/SeriesSection";

export default async function Vocab() {
  const apiData = await fetchWrapper("/recordings/series/vocabulary", {
    revalidate: 60,
  });
  const series = apiData?.data;
  return (
    <>
      <VocabHero />
      <Materials />

      <SeriesSection key={series._id} series={series} />

      <QuizList />
    </>
  );
}
