"use client";
import Image from "next/image";
import Link from "next/link";

const quizSections = [
  {
    title: "QUIZLET Lists",
    description: "Flashcards to learn vocabulary.",
    items: [
      {
        title: "",
        image: "https://images.gregmat.com/vocabPage/quizlet1.png",
        url: "https://quizlet.com/user/Blackdeathanton/folders/gregmats-vocab-list/sets",
      },
      {
        title: "",
        image: "https://images.gregmat.com/vocabPage/quizlet2.png",
        url: "https://quizlet.com/user/rafithe47/folders/gregmat-groupwise-vocab-quiz-word-list/sets",
      },
    ],
  },
  {
    title: "Commonly Confused Words & Easy Words (that are really hard)",
    items: [
      {
        title: "",
        image: "https://images.gregmat.com/vocabPage/commonly.png",
        url: "https://gregmatapi.s3.amazonaws.com/vocabPage/commonly.pdf",
      },
      {
        title: "",
        image: "https://images.gregmat.com/vocabPage/double.png",
        url: "https://docs.google.com/spreadsheets/d/1fEnvpjPNxVWbSb11vuLyeEtfCFV5WMrfzuIeP0oO7hs/edit?gid=0#gid=0",
      },
      {
        title: "Words that Affect Logic",
        image: "https://images.gregmat.com/vocabPage/contrast.png",
        url: "https://docs.google.com/spreadsheets/d/1aZfvlvrU-JRQyHDxS1IZBT_Xo6U275_6Dd5Hqn9jXV4/edit?gid=0#gid=0",
      },
      {
        title: "Pairing Strategy Heaven (Synonyms GRE Words)",
        image: "https://images.gregmat.com/vocabPage/synonyms.png",
        url: "https://docs.google.com/spreadsheets/d/1dbri_yOTeF6YUrGHKXEurtw-wtg_UuPNQVh9st_5wFM/edit?gid=0#gid=0",
      },
    ],
  },
];

export default function QuizList() {
  return (
    <section>
      {quizSections.map((section, index) => (
        <div key={index} className="mb-14">
          <h2 className="text-xl md:text-2xl font-semibold py-2 text-center md:text-left">
            {section.title}
          </h2>

          {section.description && (
            <p className="text-gray-600 text-center md:text-left">
              {section.description}
            </p>
          )}

          <div
            className={`grid ${
              section.items.length === 1
                ? "grid-cols-1"
                : section.items.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-2"
            } gap-6`}
          >
            {section.items.map((item, i) => (
              <a
                target="_blank"
                href={item.url}
                key={i}
                className="group block"
              >
                <div className="flex flex-col items-center">
                  {item.title && (
                    <h3 className="py-2 text-xl text-center text-gray-700">
                      {item.title}
                    </h3>
                  )}{" "}
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
