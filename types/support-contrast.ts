export interface ISupportContrastBlank {
  id: number;
  blank_index: number;
  reasoning_type: "support" | "contrast";
  acceptable_tokens: string;
}

export interface ISupportContrastAttempt {
  _id: string;
  user: string;
  support_contrast: string;
  blank_index: number;
  reasoning_type: "support" | "contrast";
  associated_token: string;
  correct: boolean;
  first: boolean;
  really_first: boolean;
  created_at: string;
}

export interface ISupportContrast {
  _id: string;
  id?: number;
  title: string;
  slug: string;
  text: string;
  blanks: ISupportContrastBlank[];
  acceptance: number;
  my_attempts?: ISupportContrastAttempt[];
  created_at?: string;
  updated_at?: string;
}

export interface ISupportContrastResponse {
  message: string;
  data: ISupportContrast[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPage: number;
    userScore?: number;
    userAttempted?: number;
    totalBlanks?: number;
  };
}

export interface ISupportContrastAttemptSubmission {
  supportContrastId: string;
  blank_index: number;
  reasoning_type: "support" | "contrast";
  associated_token: string;
  correct: boolean;
}
