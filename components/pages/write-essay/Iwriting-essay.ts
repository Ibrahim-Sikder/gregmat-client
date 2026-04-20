export interface IDefaultPrompt {
  _id?: string;
  body?: string;
}

export interface IFeedback {
  bodyParagraph1: string | null;
  bodyParagraph2: string | null;
  conclusion: string | null;
  development: string | null;
  grammar: string | null;
  organization: string | null;
  overallAdvice: string | null;
  score: number | null;
  summary: string | null;
}

export interface IWritingEssay {
  _id: string;
  userId: string;
  promptId: string;
  promptBody: string;
  essayContent: string;
  wordCount: number;
  estimatedTime: string;
  feedback: IFeedback;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
