export interface ISentencePart {
  id: number;
  order: number;
  content: string;
  description: string;
  is_answer: boolean;
}

export interface ISentenceFunction {
  _id: string;
  id?: number;
  title: string;
  slug: string;
  body: string;
  source: string;
  sentence_parts: ISentencePart[];
  acceptance: number;
  created_at?: string;
  updated_at?: string;
  user_attempt?: {
    selected_sentence_part: number;
    correct: boolean;
    first: boolean;
    really_first: boolean;
    created_at: string;
  };
}

export interface ISentenceFunctionAttemptSubmission {
  sentenceFunctionId: string;
  selected_sentence_part: number;
  correct: boolean;
}

export interface ISentenceFunctionResponse {
  data: ISentenceFunction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    userScore?: number;
    userAttempted?: number;
  };
}
