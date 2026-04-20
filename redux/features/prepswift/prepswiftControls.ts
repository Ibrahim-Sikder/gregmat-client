import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PrepSwiftControlsState {
  autoPlayVideo: boolean;
  playNextVideoAutomatic: boolean;
  showAction: boolean;
  showVideoDuration: boolean;
  selectedCategory: string[];
}

const initialState: PrepSwiftControlsState = {
  autoPlayVideo: false,
  playNextVideoAutomatic: false,
  showAction: true,
  showVideoDuration: true,
  selectedCategory: [],
};

const PrepSwiftControlsSlice = createSlice({
  name: "prepSwiftControls",
  initialState,
  reducers: {
    toggleAutoPlay(state) {
      state.autoPlayVideo = !state.autoPlayVideo;
    },
    togglePlayNext(state) {
      state.playNextVideoAutomatic = !state.playNextVideoAutomatic;
    },
    toggleShowAction(state) {
      state.showAction = !state.showAction;
    },
    toggleShowVideoDuration(state) {
      state.showVideoDuration = !state.showVideoDuration;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      const category = action.payload;
      const index = state.selectedCategory.indexOf(category);
      if (index > -1) {
        state.selectedCategory.splice(index, 1);
      } else {
        state.selectedCategory.push(category);
      }
    },
    clearSelectedCategories(state) {
      state.selectedCategory = [];
    },
  },
});

export const {
  toggleAutoPlay,
  togglePlayNext,
  toggleShowAction,
  toggleShowVideoDuration,
  setSelectedCategory,
  clearSelectedCategories,
} = PrepSwiftControlsSlice.actions;

export default PrepSwiftControlsSlice.reducer;
