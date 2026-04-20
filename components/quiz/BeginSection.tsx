import QuizContent from "./QuizContent";
import Container from "../shared/container/Container";

export default function BeginSection() {
  // if (!isBeginSection) {
  //   return (
  //     <Container>
  //       <div className="flex flex-col items-center justify-center p-8">
  //         <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>

  //         <button
  //           onClick={handleBeginSection}
  //           className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
  //         >
  //           Begin Quiz
  //         </button>
  //       </div>
  //     </Container>
  //   );
  // }

  return (
    <Container>
      <QuizContent />
    </Container>
  );
}
