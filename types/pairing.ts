export interface IPair {
  first_word: string;
  second_word: string;
}

export interface IPairing {
  _id: string; // or id number if coming from that API
  id?: number;
  title: string;
  slug: string;
  body: string;
  pairs: IPair[];
  acceptance: number;
  my_attempts?: IPairingAttempt[];
  created_at?: string;
  updated_at?: string;
}

export interface IPairAttemptItem {
  first_word: string;
  second_word: string;
}

export interface IPairingAttempt {
  _id?: string;
  score: number;
  correct: boolean;
  first: boolean;
  really_first: boolean;
  attempt: IPairAttemptItem[]; // array of pairs submitted
  created_at: string;
}

export interface IPairingAttemptSubmission {
  pairingId: string;
  score: number;
  correct: boolean;
  attempt: IPairAttemptItem[];
}

export interface IPairingResponse {
  data: IPairing[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    userScore?: number;
    userAttempted?: number;
  };
}
