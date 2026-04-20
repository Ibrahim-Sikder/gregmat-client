import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IClass } from '@/components/pages/recordings/Iclass';

interface CourseClassState {
  classes: IClass[];
  currentIndex: number;
}

const initialState: CourseClassState = {
  classes: [],
  currentIndex: 0,
};

const courseClassSlice = createSlice({
  name: 'courseClass',
  initialState,
  reducers: {
    setClasses: (state, action: PayloadAction<IClass[]>) => {
      state.classes = action.payload;
      state.currentIndex = 0;
    },
    nextClass: (state) => {
      if (state.currentIndex < state.classes.length - 1) {
        state.currentIndex += 1;
      }
    },
    prevClass: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },
  },
});

export const { setClasses, nextClass, prevClass } = courseClassSlice.actions;
export default courseClassSlice.reducer;
