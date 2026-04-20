import { Choice } from "@/components/quiz/TQuiz";
import { stripHtml } from "./stripHtml";

export function getFormattedAnswer(pairingAnswer: { pair: Choice[] }[]): string {
  return pairingAnswer
    .map(p => {
      const first = stripHtml(p.pair[0].body);
      const second = stripHtml(p.pair[1].body);
      return `${first}&&&${second}`;
    })
    .join("___");
}
