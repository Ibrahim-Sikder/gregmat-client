import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PassagesState {
  currentParagraph: number;
  userInputs: string[];
}

const initialState: PassagesState = {
  currentParagraph: 0,
  userInputs: [],
};

const passagesSlice = createSlice({
  name: 'passages',
  initialState,
  reducers: {
    initializeParagraphs: (state, action: PayloadAction<number>) => {
      state.userInputs = Array(action.payload).fill('');
      state.currentParagraph = 0;
    },
    updateInput: (state, action: PayloadAction<{ index: number; value: string }>) => {
      state.userInputs[action.payload.index] = action.payload.value;
    },
    nextParagraph: (state) => {
      if (state.currentParagraph < state.userInputs.length - 1) {
        state.currentParagraph += 1;
      }
    },
    prevParagraph: (state) => {
      if (state.currentParagraph > 0) {
        state.currentParagraph -= 1;
      }
    },
    setCurrentParagraph: (state, action: PayloadAction<number>) => {
      state.currentParagraph = action.payload;
    },
  },
});

export const {
  initializeParagraphs,
  updateInput,
  nextParagraph,
  prevParagraph,
  setCurrentParagraph,
} = passagesSlice.actions;

export default passagesSlice.reducer;
