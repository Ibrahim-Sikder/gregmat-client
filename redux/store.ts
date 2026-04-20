import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import { baseApi } from "./api/baseApi";
import quizControlReducer from "./features/quiz/quizControlSlice";
import quizDataReducer from "./features/quiz/quizDataSlice";
import mountainControlReducer from "./features/mountain/mountainControlSlice";
import prepSwiftControlReducer from "./features/prepswift/prepswiftControls";
import courseClassReducer from "./features/courses/courseClassSlice";
import writingEssayReducer from "./features/writing-essay/writingEssaySlice";
import passageReducer from "./features/skills-building/passagesSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    quizControl: quizControlReducer,
    quizData: quizDataReducer,
    mountainControl: mountainControlReducer,
    prepSwiftControl: prepSwiftControlReducer,
    courseClass: courseClassReducer,
    writingEssay: writingEssayReducer,
    passage: passageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
