import { IDefaultPrompt, IWritingEssay } from '@/components/pages/write-essay/Iwriting-essay';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EssayState {
  allPrompt: IDefaultPrompt[] | null;
  prompt: IDefaultPrompt | null;
  essay: IWritingEssay | null;
  wordCount: number;
  charCount: number;
  isLoading: boolean;
  showCount: boolean;
  text: string;
  timeLeft: number;
  search: string;
}

const initialState: EssayState = {
  allPrompt: null,
  prompt: null,
  essay: null,
  wordCount: 0,
  charCount: 0,
  isLoading: false,
  showCount: true,
  text: '',
  timeLeft: 30,
  search: '',
};

const essaySlice = createSlice({
  name: 'writing-essay',
  initialState,
  reducers: {
    setALLPrompt: (state, action: PayloadAction<IDefaultPrompt[]>) => {
      state.allPrompt = action.payload;
    },
    setPrompt: (state, action: PayloadAction<IDefaultPrompt>) => {
      state.prompt = action.payload;
    },
    setEssay: (state, action: PayloadAction<IWritingEssay>) => {
      state.essay = action.payload;
      state.wordCount = action.payload.essayContent.trim()
        ? action.payload.essayContent.trim().split(/\s+/).length
        : 0;
      state.charCount = action.payload.essayContent.length;
    },
    setRandom: (state) => {
      if (state.allPrompt && state.allPrompt.length > 0) {
        const randomIndex = Math.floor(Math.random() * state.allPrompt.length);
        state.prompt = state.allPrompt[randomIndex];
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setShowCount: (state, action: PayloadAction<boolean>) => {
      state.showCount = action.payload;
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.charCount = action.payload;
    },
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    clearEssay: (state) => {
      state.essay = null;
      state.text = '';
      state.wordCount = 0;
      state.charCount = 0;
    },
  },
});

export const {
  setALLPrompt,
  setPrompt,
  setEssay,
  clearEssay,
  setRandom,
  setLoading,
  setShowCount,
  setCount,
  setText,
  setSearch,
} = essaySlice.actions;
export default essaySlice.reducer;
