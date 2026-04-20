export interface Problem {
  _id: string;
  title: string;
  type: string;
  question_type: string;
  difficulty: string;
  super_category: string;
  is_plus_only: boolean;
  acceptance_rate: number;
  slug: string;
  browser_title: string;
  likes: number;
  has_solution_video: boolean;
  solution_video: string | null;
  first_tlc: string | null;
  tag: string;
  status: "ToDo" | "Attempted" | "Solved";
  liked: boolean;
  disliked: boolean;
  bookmarked: boolean;
  successRate: number;
  dynamicDifficulty: string;
  createdAt: string;
  updatedAt: string;
  user_answer_attempts?: {
    answered_at: string;
    correct: boolean;
    first: boolean;
  }[];
  // Full problem data (available when fetching single problem)
  question?: string;
  note?: string;
  answer?: string | string[];
  answers?: string[];
  correct_answer?: string | string[];
  solution?: string;
}

export interface ProblemFilters {
  page?: number;
  limit?: number;
  super_category?: string;
  difficulty?: string[];
  status?: string[];
  type?: string[];
  search?: string;
  tag?: string[];
  category?: string[];
  has_solution?: boolean;
  bookmarked?: boolean;
}

export interface ProblemMeta {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
}

export interface ProblemsResponse {
  success: boolean;
  message: string;
  data: Problem[];
  meta: ProblemMeta;
}

// Question Type enum matching backend
export enum QuestionType {
  QuantitativeComparison = "quantitative_comparison",
  MultipleChoice = "multiple_choice",
  MultipleSelect = "multiple_select",
  NumericEntryFraction = "numeric_entry_fraction",
  NumericEntryNotFraction = "numeric_entry_not_fraction",
  TC1Blank = "tc_1_blank",
  TC2Blank = "tc_2_blank",
  TC3Blank = "tc_3_blank",
  ReadingMultipleChoice = "reading_multiple_choice",
  ReadingSelectAll = "reading_select_all",
  SentenceEquivalence = "sentence_equivalence",
  Matching = "matching",
  FillInTheBlank = "fill_in_the_blank",
  Pairing = "pairing",
}

// Display names for question types
export const QUESTION_TYPE_DISPLAY: Record<string, string> = {
  [QuestionType.QuantitativeComparison]: "Quantitative Comparison",
  [QuestionType.MultipleChoice]: "Multiple Choice",
  [QuestionType.MultipleSelect]: "Multiple Select",
  [QuestionType.NumericEntryFraction]: "Numeric Entry (Fraction)",
  [QuestionType.NumericEntryNotFraction]: "Numeric Entry",
  [QuestionType.TC1Blank]: "Text Completion (1 Blank)",
  [QuestionType.TC2Blank]: "Text Completion (2 Blanks)",
  [QuestionType.TC3Blank]: "Text Completion (3 Blanks)",
  [QuestionType.ReadingMultipleChoice]: "Reading Comprehension",
  [QuestionType.ReadingSelectAll]: "Reading (Select All)",
  [QuestionType.SentenceEquivalence]: "Sentence Equivalence",
  [QuestionType.Matching]: "Matching",
  [QuestionType.FillInTheBlank]: "Fill in the Blank",
  [QuestionType.Pairing]: "Pairing",
};

// Filter option types - using lowercase for difficulties to match backend
export const DIFFICULTIES = [
  "tbd",
  "easy",
  "medium",
  "hard",
  "extreme",
] as const;

// Display names for difficulties (for UI)
export const DIFFICULTY_DISPLAY: Record<string, string> = {
  tbd: "TBD",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  extreme: "Extreme",
};

export const STATUSES = ["To Do", "Attempted", "Solved"] as const;

// Question types for filter (Quant)
export const QUANT_QUESTION_TYPES = [
  QuestionType.QuantitativeComparison,
  QuestionType.MultipleChoice,
  QuestionType.MultipleSelect,
  QuestionType.NumericEntryFraction,
  QuestionType.NumericEntryNotFraction,
] as const;

// Question types for filter (Verbal)
export const VERBAL_QUESTION_TYPES = [
  QuestionType.TC1Blank,
  QuestionType.TC2Blank,
  QuestionType.TC3Blank,
  QuestionType.ReadingMultipleChoice,
  QuestionType.ReadingSelectAll,
  QuestionType.SentenceEquivalence,
] as const;

export const CATEGORIES = [
  "Arithmetic",
  "Algebra",
  "Geometry",
  "Data Analysis",
] as const;
export const TAGS = [
  "3-D Figures",
  "Absolute Value",
  "Angles",
  "Area",
  "Average",
  "Circles",
  "Combinations",
  "Coordinate Geometry",
  "Counting",
  "Data Interpretation",
  "Decimals",
  "Divisibility",
  "Equations",
  "Exponents",
  "Factors",
  "Fractions",
  "Functions",
  "GCD/LCM",
  "Inequalities",
  "Integer Properties",
  "Lines",
  "Mean/Median/Mode",
  "Mixtures",
  "Number Line",
  "Number Properties",
  "Overlapping Sets",
  "Percent",
  "Perimeter",
  "Permutations",
  "Polygons",
  "Probability",
  "Proportions",
  "Quadratics",
  "Radicals",
  "Rate/Work",
  "Ratios",
  "Rectangles",
  "Remainders",
  "Sequences",
  "Sets",
  "Simplifying",
  "Squares",
  "Statistics",
  "Surface Area",
  "Triangles",
  "Variables",
  "Volume",
  "Word Problems",
] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];
export type Status = (typeof STATUSES)[number];
export type Category = (typeof CATEGORIES)[number];
export type Tag = (typeof TAGS)[number];
