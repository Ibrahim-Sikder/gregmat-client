import { getFlashcards } from "@/actions/flashcards";
import { getMountains } from "@/actions/mountain";
import { getStudyPlans, IPlan } from "@/actions/plans";
import {
  getPracticeQuizzes,
  getQuizCollections,
  IQuizzes,
} from "@/actions/quizzes";
import { TNavLinks } from "./types";

export const preSwiftNavLinks = [
  {
    title: "Quizzes",
    url: "/prep-swift/quizzes/all?website=GMPS",
  },
  {
    title: "Your Super Quiz",
    url: "/prep-swift/your-super-quiz",
  },
  {
    title: "Bookmarked",
    url: "/prep-swift/bookmarked",
  },
];

export async function buildNavLinks(): Promise<TNavLinks> {
  const [studyPlans, practiceQuizzes, collections, mountains, flashcards] =
    await Promise.all([
      getStudyPlans(),
      getPracticeQuizzes(),
      getQuizCollections(),
      getMountains(),
      getFlashcards(),
    ]);
  return [
    {
      categoryname: "Classes",
      children: [
        {
          subCategoryname: "Recorded Classes",
          subTitle: "Enjoy recorded content from previous classes, anytime.",
          iconName: "BookOpen",
          href: "/recordings",
        },
        {
          subCategoryname: "New Content Feed",
          subTitle: "Catch up on missed classes.",
          iconName: "PlaySquare",
          href: "/feed",
        },
        {
          subCategoryname: "Must See Recordings",
          subTitle:
            "Watch the most famous and most useful classes ever conducted.",
          iconName: "Video",
          href: "/course/must-see-videos",
        },
      ],
    },
    {
      categoryname: "Study Plans",
      children: studyPlans?.map((plan: IPlan) => ({
        subCategoryname: plan?.title,
        subTitle: plan?.tagline,
        iconName: "ListChecks",
        href: `/study-plans/${plan?.slug}`,
      })),
    },
    {
      categoryname: "Practice",
      children: [
        {
          subCategoryname: "Skill Building",
          subTitle:
            "Practice skills in isolation to identify strengths and weaknesses.",
          iconName: "Dumbbell",
          href: "/skill-building",
        },
        ...practiceQuizzes?.map((quiz: IQuizzes) => ({
          subCategoryname: quiz?.title,
          subTitle: quiz?.tagline,
          iconName: "Timer",
          href: `/practices/${quiz?.slug}`,
        })),

        {
          subCategoryname: "Quant Problems",
          subTitle: "603 Problems and counting...",
          iconName: "Sigma",
          href: "/practices/quant-problems",
        },
        {
          subCategoryname: "Verbal Problems",
          subTitle: "319 Problems and counting...",
          iconName: "BookMarked",
          href: "/practices/verbal-problems",
        },
        {
          subCategoryname: "Write Essay",
          subTitle: "Practice writing GRE essays.",
          iconName: "PenTool",
          href: "/write-essay",
        },
      ],
    },
    {
      categoryname: "Quizzes",
      children: [
        ...collections?.map((collection: IQuizzes) => ({
          subCategoryname: collection?.title,
          subTitle: collection?.tagline,
          iconName: "Layers",
          href: `/quizzes/collection/${collection?.slug}`,
        })),
        {
          subCategoryname: "Live Class Quizzes",
          subTitle: "Various quizzes conducted during past live classes.",
          iconName: "Zap",
          href: "/quizzes/live-class-quizzes",
        },
        {
          subCategoryname: "Your Super Quiz",
          subTitle: "Review all saved questions.",
          iconName: "Sparkles",
          href: "/quizzes/super-quiz",
          target: "_blank",
        },
      ],
    },
    {
      categoryname: "Memorize",
      children: [
        ...mountains?.map((mountain: any) => ({
          subCategoryname: mountain?.title,
          subTitle: mountain?.tagline,
          iconName: "Mountain",
          href: `/mountains/${mountain?.slug}`,
        })),
        {
          subCategoryname: "GRE Vocab List",
          subTitle: "Browse all 34 groups.",
          iconName: "ListChecks",
          target: "blank",
          href: "https://docs.google.com/spreadsheets/d/1jRATLVV34vATsL4Y67fZZXQc7qZPYc0c0Yk7Bykh4fw/edit?gid=0#gid=0",
        },
        ...flashcards.map((flashcard: any) => ({
          subCategoryname: flashcard?.title,
          subTitle: flashcard?.description ?? "Flashcard collection.",
          iconName: "IdCard",
          href: `/course-group/${flashcard?.slug}`,
        })),
        {
          subCategoryname: "Support/Contrast List",
          subTitle: "Memorize essential words.",
          iconName: "ListChecks",
          target: "blank",
          href: "https://docs.google.com/spreadsheets/d/1jQ3olVKMXJThLp7j_S8Fh6g4sAibD11-vHeMnBKIsFM/edit?gid=0#gid=0",
        },
        {
          subCategoryname: "Vocab Resources",
          subTitle: "One-stop shop for vocabulary resources.",
          iconName: "FolderOpen",
          href: "/vocab",
        },
      ],
    },
    {
      categoryname: "More",
      children: [
        {
          subCategoryname: "Blogs",
          subTitle: "Insights into the world of test prep.",
          iconName: "Newspaper",
          target: "_blank",
          href: "https://www.gregmat.com/blog",
        },
        {
          subCategoryname: "PrepSwift",
          subTitle: "Superfast, supercheap test prep.",
          iconName: "Zap",
          href: "/prep-swift",
        },
        {
          subCategoryname: "English Pro",
          subTitle: "Improve your English speaking and pronunciation.",
          iconName: "Mic",
          href: "https://courses.sandiegovoiceandaccent.com/bundles/english-pro",
          target: "_blank",
        },
        {
          subCategoryname: "Admissions",
          subTitle: "Help writing your personal statement.",
          iconName: "FileText",
          href: "/admissions",
        },
        {
          subCategoryname: "Old Site",
          subTitle: "Travel back in time!",
          iconName: "History",
          href: "https://old.gregmat.com",
          target: "_blank",
        },
        {
          subCategoryname: "Help Desk",
          subTitle: "GregMat Support Center.",
          iconName: "LifeBuoy",
          href: "https://help.gregmat.com/en/",
          target: "_blank",
        },
      ],
    },
  ];
}
