import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QuizState {
  speed: string;
  isBegin: boolean;
  isBeginSection: boolean;
  isReviewed: boolean;
  timeLeft: number;
  attemptReviewModal: boolean;
  submissionModal: boolean;
  solutionAttempting: boolean;
  isCorrectAnswer: boolean;
  isSuperQuiz: boolean;
}

const initialState: QuizState = {
  speed: 'none',
  isBegin: false,
  isBeginSection: false,
  isReviewed: false,
  timeLeft: 0,
  attemptReviewModal: false,
  submissionModal: false,
  solutionAttempting: false,
  isCorrectAnswer: false,
  isSuperQuiz: false,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setSpeed: (state, action: PayloadAction<string>) => {
      state.speed = action.payload;
    },
    setBegin: (state, action: PayloadAction<boolean>) => {
      state.isBegin = action.payload;
    },

    setBeginSection: (state, action: PayloadAction<boolean>) => {
      state.isBeginSection = action.payload;
    },
    setTimeLeft: (state, action: PayloadAction<number>) => {
      state.timeLeft = action.payload;
    },
    setReviewed: (state, action: PayloadAction<boolean>) => {
      state.isReviewed = action.payload;
    },
    decrementTime: (state) => {
      if (state.timeLeft > 0) state.timeLeft -= 1;
    },
    setAttemptReviewModal: (state, action: PayloadAction<boolean>) => {
      state.attemptReviewModal = action.payload;
    },
    setSubmissionModal: (state, action: PayloadAction<boolean>) => {
      state.submissionModal = action.payload;
    },
    setSolutionAttempting(state, action: PayloadAction<boolean>) {
      state.solutionAttempting = action.payload;
    },
    setIsCorrectAnswer(state, action: PayloadAction<boolean>) {
      state.isCorrectAnswer = action.payload;
    },
    setIsSuperQuiz(state, action: PayloadAction<boolean>) {
      state.isSuperQuiz = action.payload;
    },
    resetQuizControl: (state) => {
      state.isBegin = false;
      state.speed = 'none';
      state.isBeginSection = false;
      state.timeLeft = 0;
    },
  },
});

export const {
  setBegin,
  setBeginSection,
  setSpeed,
  setTimeLeft,
  decrementTime,
  resetQuizControl,
  setReviewed,
  setAttemptReviewModal,
  setSubmissionModal,
  setSolutionAttempting,
  setIsCorrectAnswer,
  setIsSuperQuiz,
} = quizSlice.actions;
export default quizSlice.reducer;
