import { AttemptGroup, IAnswer, QuizData } from "@/components/quiz/TQuiz";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IBookmarkedQuestion {
  questionIndex: number;
}

interface IQuiz {
  data: QuizData | null;
  currentQuestionIndex: number;
  answers: IAnswer[];
  bookmarkedQuestions: IBookmarkedQuestion[];
  submitted: boolean;
  quizStartTime: number | null;
  questionStartTime: number | null;
  userId: string;
  selectedAttemptGroup?: AttemptGroup | null;
  currentQuestionId: string;
}

const initialState: IQuiz = {
  data: null,
  currentQuestionIndex: 0,
  answers: [],
  bookmarkedQuestions: [],
  submitted: false,
  quizStartTime: null,
  questionStartTime: null,
  userId: "",
  selectedAttemptGroup: null,
  currentQuestionId: "",
};

const quizDataSlice = createSlice({
  name: "quizData",
  initialState,
  reducers: {
      setQuizData: (state, action: PayloadAction<QuizData>) => {
      const now = Date.now();
      state.data = action.payload;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.bookmarkedQuestions = [];
      state.submitted = false;
      state.quizStartTime = now;
      state.questionStartTime = now;
    },

    saveAnswer: (state, action: PayloadAction<IAnswer>) => {
      const { question: questionId, given_answer } = action.payload;

      const q = state.data?.questions.find((ques) => ques._id === questionId);
      if (!q) return;


      const answerValue = Array.isArray(given_answer)
        ? given_answer.join(",")
        : String(given_answer ?? "");

      const existingIndex = state.answers.findIndex(
        (a) => a.question === questionId,
      );

      const newAnswer: IAnswer = {
        ...action.payload,
        given_answer: answerValue,
        seconds: action.payload.seconds ?? 0,
        score: action.payload.score ?? 0,
        score_denom: action.payload.score_denom ?? q.max_score ?? 0,
        answered_at: new Date().toISOString(),
        quiz: q.quiz,
        collection: state.data?.collection ?? "",
      };

      if (existingIndex >= 0) {
        state.answers[existingIndex] = {
          ...state.answers[existingIndex],
          ...newAnswer,
        };
      } else {
        state.answers.push(newAnswer);
      }

    },

    toggleBookmark: (
      state,
      action: PayloadAction<{ questionIndex: number }>,
    ) => {
      const { questionIndex } = action.payload;
      const idx = state.bookmarkedQuestions.findIndex(
        (b) => b.questionIndex === questionIndex,
      );
      if (idx >= 0) state.bookmarkedQuestions.splice(idx, 1);
      else state.bookmarkedQuestions.push({ questionIndex });
    },

    nextQuestion: (state) => {
      if (!state.data?.questions) return;

      const currentQuestion = state.data.questions[state.currentQuestionIndex];
      const timeSpent = state.questionStartTime
        ? Math.floor((Date.now() - state.questionStartTime) / 1000)
        : 0;

      const existing = state.answers.find(
        (a) => a.question === currentQuestion._id,
      );
      if (existing) {
        existing.seconds = (existing.seconds || 0) + timeSpent;
      } else {
        state.answers.push({
          user: state.userId,
          question: currentQuestion._id,
          quiz: state.data._id,
          collection: state.data.collection || "",
          given_answer: "",
          correct: false,
          seconds: timeSpent,
          score: 0,
          score_denom:
            state.data.questions[state.currentQuestionIndex].max_score || 0,
          answered_at: new Date().toISOString(),
        });
      }

      if (state.currentQuestionIndex < state.data.questions.length - 1) {
        state.currentQuestionIndex += 1;
        state.questionStartTime = Date.now();
      }
    },

    prevQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
        state.questionStartTime = Date.now();
      }
    },

    goToQuestion: (state, action: PayloadAction<{ questionIndex: number }>) => {
      if (
        state.data?.questions &&
        action.payload.questionIndex >= 0 &&
        action.payload.questionIndex < state.data.questions.length
      ) {
        state.currentQuestionIndex = action.payload.questionIndex;

        state.questionStartTime = Date.now();
      }
    },

    submitQuiz: (state) => {
      if (state.quizStartTime) {
        const totalTime = Math.floor((Date.now() - state.quizStartTime) / 1000);
        const totalQuestionsTime = state.answers.reduce(
          (sum, a) => sum + (a.seconds || 0),
          0,
        );

        if (state.data) {
          (state.data as any).totalTakenTime = totalTime;
          (state.data as any).questionsTakenTime = totalQuestionsTime;
        }
      }
      state.submitted = true;
    },

    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },

    setSelectedAttemptGroup: (state, action: PayloadAction<AttemptGroup>) => {
      state.selectedAttemptGroup = action.payload;
    },

    setCurrentQuestionId: (state, action: PayloadAction<string>) => {
      state.currentQuestionId = action.payload;
    },

    resetQuizData: (state) => {
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.bookmarkedQuestions = [];
      state.submitted = false;
      state.quizStartTime = null;
      state.questionStartTime = null;
    },
  },
});

export const {
  setQuizData,
  saveAnswer,
  toggleBookmark,
  nextQuestion,
  prevQuestion,
  goToQuestion,
  submitQuiz,
  resetQuizData,
  setUserId,
  setSelectedAttemptGroup,
  setCurrentQuestionId,
} = quizDataSlice.actions;

export default quizDataSlice.reducer;
