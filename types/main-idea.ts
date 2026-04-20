export interface ISentence {
  body: string;
  order_in_paragraph: number;
  source: string;
  context?: string | null;
}

export interface IParagraph {
  _id: string;
  order_in_passage: number;
  body: string;
  sentences: ISentence[];
  main_idea: string;
  passage_source: string;
  context: string;
}

export interface IMainIdeaPractice {
  _id: string;
  title: string;
  slug: string;
  mode: "paragraph" | "Passage";
  user_generated: boolean;
  count: number;
  paragraphs: IParagraph[];
  attempted: boolean;
  attempts?: IMainIdeaAttemptResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface IParagraphAttempt {
  paragraph: string;
  given_main_idea: string;
}

export interface IMainIdeaAttemptSubmission {
  mainIdeaPractice: string;
  paragraph_attempts: IParagraphAttempt[];
}

export interface IMainIdeaAttemptResponse {
  _id: string;
  mainIdeaPractice: string;
  user: string;
  graded: boolean;
  score: number;
  paragraph_attempts: {
    paragraph: string | IParagraph;
    given_main_idea: string;
    reported: boolean;
    gpt_score: number | null;
    gpt_comment: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
