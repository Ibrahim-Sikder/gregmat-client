// types.ts
export interface QuizAttempt {
  first: boolean;
  score: number;
  created_at: string;
  normalized_score: number;
}

export interface Quiz {
  _id: string;
  title: string;
  slug: string;
  img: string;
  minutes: number;
  super_category: string;
  plus_only: boolean;
  timing_mode: string;
  max_score: number;
  mean_score: number;
  normalized_mean_score: number;
  highest_score: number;
  lowest_score: number;
  associated_class: string;
  associated_content: string;
  order_in_group: number;
  attempts: QuizAttempt[];
  number_of_attempts: number;
  number_of_bookmarks: number;
  number_of_likes: number;
  solution: string;
  is_prepswift: boolean;
}

export interface QuizItem {
  quiz: Quiz;
}

export interface GroupStatistics {
  total_quizzes: number;
  completed_quizzes: number;
  first_attempt_average: number;
  normalized_first_attempt_average: number;
  latest_attempt_average: number;
  normalized_latest_attempt_average: number;
}

export interface QuizGroup {
  title: string;
  img: string | null;
  slug: string;
  body: string;
  quizzes: QuizItem[];
  access: string;
  website: string;
  statistics: GroupStatistics;
}

export interface QuizCollectionData {
  _id: string;
  title: string;
  slug: string;
  img: string | null;
  body: string;
  quiz_groups: QuizGroup[];
  website: string;
  created_at: string;
  updated_at: string;
  tagline: string;
}

export interface QuizCollectionContentProps {
  collectionData: QuizCollectionData;
}
