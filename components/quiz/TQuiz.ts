export interface AttemptItem {
  user: string;
  answered_at: string;
  given_answer: string;
  correct: boolean;
  question: string;
  quiz: string;
  collection: string;
  score: number;
  score_denom: number;
  seconds: number;
}

export interface Summary {
  total_questions: number;
  correct: number;
  incorrect: number;
  total_score: number;
  total_score_denom: number;
  [key: string]: any;
}

export interface AttemptGroup {
  attempts: AttemptItem[];
  createdAt: string;
  created_at: string;
  given_essay: string;
  summary: Summary;
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface LeftSideText {
  title: string;
  body: string;
}

export interface Choice {
  order: number;
  title: string;
  body: string;
}

export interface ChoiceGroup {
  title: string;
  choices: Choice[];
}

export type QuestionType =
  | "quantitative_comparison"
  | "multiple_choice"
  | "multiple_select"
  | "tc_1_blank"
  | "tc_2_blank"
  | "tc_3_blank"
  | "reading_multiple_choice"
  | "sentence_equivalence"
  | "numeric_entry_not_fraction"
  | "numeric_entry_fraction";

export interface Question {
  _id: string;
  title: string;
  short_meta: string;
  type: QuestionType;
  body: string;
  choice_groups: ChoiceGroup[];
  slug: string;
  has_solution_video: boolean;
  can_watch: boolean;
  solution_video: string;
  answer: string;
  max_score: number;
  source: string;
  super_category: string;
  solution_has_video: boolean;
  left_side_text: LeftSideText | null;
  order_in_quiz: number;
  quiz: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface QuizData {
  _id: string;
  plus_only: boolean;
  img: string;
  title: string;
  body: string;
  completion_body: string;
  slug: string;
  minutes: number;
  questions: Question[];
  super_category: string;
  timing_mode: string;
  emotions: any[];
  is_shown_in_quizdata: boolean;
  is_multisection: boolean;
  visible_sections: number;
  scale_to_gre: boolean;
  scaling_formula: string;
  begins_with_writing: boolean;
  writing_prompt: string;
  sections: Section[];
  break_minutes: number;
  experimental: boolean;
  is_prepswift: boolean;
  associated_class: string;
  associated_content: string;
  attempts: AttemptGroup[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  total_questions: number;
  total_sections: number;
  collection: string;
  solution: string;
  notes?: string;
}

export interface Section {
  identifier: number;
  title: string;
  section_type: string;
  minutes: number;
  description: string;
  questions: Question[];
  question_count: number;
  start_index: number;
  end_index: number;
}

//for answers:
export interface IAnswer {
  user: string;
  question: string;
  quiz: string;
  collection: string;
  given_answer: string;
  correct: boolean;
  score: number;
  score_denom: number;
  seconds: number;
  answered_at?: string;
}
