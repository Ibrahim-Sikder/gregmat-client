import { MountainCategory } from "@/components/mountain/IMountain";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotesState {
  [word: string]: string;
}

interface MountainControlState {
  selectedWord: string | null;
  selectedWordData: any | null;
  categories: MountainCategory[];
  currentGroupIndex: number;
  currentWordIndex: number;
  isOpenModal: boolean;
  isCenterDefinition: boolean;
  isControlOptionOpen: boolean;
  isPrevDayColor: boolean;
  isColorBlindMode: boolean;
  isDefinitionOnNavigate: boolean;
  notes: NotesState;
  showFilter: string;
  orderFilter: string;
  currentPage: number;
  autoMoveMakingGreen: boolean;
}

const savedNotes =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("mountain_notes") || "{}")
    : {};

const initialState: MountainControlState = {
  selectedWord: null,
  selectedWordData: null,
  categories: [],
  currentGroupIndex: 0,
  currentWordIndex: 0,
  currentPage: 0,
  isColorBlindMode: false,
  isOpenModal: false,
  isCenterDefinition: false,
  isControlOptionOpen: false,
  isPrevDayColor: true,
  isDefinitionOnNavigate: false,
  notes: savedNotes,
  showFilter: "all",
  orderFilter: "default",
  autoMoveMakingGreen: false,
};

const mountainControlSlice = createSlice({
  name: "mountainControl",
  initialState,
  reducers: {
    setSelectedId(state, action: PayloadAction<string>) {
      state.selectedWord = action.payload;
    },
    setSelectedWordData(state, action: PayloadAction<any>) {
      state.selectedWordData = action.payload;
    },
    setIsModalOpen(state, action: PayloadAction<boolean>) {
      state.isOpenModal = action.payload;
    },
    setIsControlOptionOpen(state, action: PayloadAction<boolean>) {
      state.isControlOptionOpen = action.payload;
    },
    setCenterDefinition(state, action: PayloadAction<boolean>) {
      state.isCenterDefinition = action.payload;
    },
    setDefinitionOnNavigate(state, action: PayloadAction<boolean>) {
      state.isDefinitionOnNavigate = action.payload;
    },
    setPrevDayColor(state, action: PayloadAction<boolean>) {
      state.isPrevDayColor = action.payload;
    },

    setIsColorBlindMode(state, action: PayloadAction<boolean>) {
      state.isColorBlindMode = action.payload;
    },
    setAutoMoveMakingGreen(state, action: PayloadAction<boolean>) {
      state.autoMoveMakingGreen = action.payload;
    },
    setCategories(state, action: PayloadAction<MountainCategory[]>) {
      state.categories = action.payload;
    },
    moveSelection(
      state,
      action: PayloadAction<{ groupIndex: number; wordIndex: number }>,
    ) {
      state.currentGroupIndex = action.payload.groupIndex;
      state.currentWordIndex = action.payload.wordIndex;
    },
    setShowFilter(state, action: PayloadAction<string>) {
      state.showFilter = action.payload;
    },
    setOrderFilter(state, action: PayloadAction<string>) {
      state.orderFilter = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setNote(state, action: PayloadAction<{ word: string; note: string }>) {
      const { word, note } = action.payload;
      if (note.trim() === "") {
        delete state.notes[word];
      } else {
        state.notes[word] = note;
      }
      localStorage.setItem("mountain_notes", JSON.stringify(state.notes));
    },
    setWordColor(
      state,
      action: PayloadAction<{ wordId: string; color: string }>,
    ) {
      const { wordId, color } = action.payload;
      // Update in categories
      for (const category of state.categories) {
        const word = category.mountain_contents.find((w) => w._id === wordId);
        if (word) {
          if (!word.colors) word.colors = {};
          // Use ISO string for key to ensure it's likely "last" if sorted by key,
          // or just relied on checks.
          // VocabularyCard uses Object.values().at(-1), so insertion order matters in JS for non-integer keys?
          // Actually Object.values order is not guaranteed for strict standards but usually follows insertion for strings.
          // Better to use a timestamp key that sorts at the end if the logic sorts by key.
          // Or if it just takes values, adding one at the end works.
          word.colors[new Date().toISOString()] = color;

          // Also update selectedWordData if it matches
          if (state.selectedWordData && state.selectedWordData._id === wordId) {
            state.selectedWordData.colors = { ...word.colors };
          }
          break;
        }
      }
    },
    setCategoryColors(
      state,
      action: PayloadAction<{ categoryId: string; color: string }>,
    ) {
      const { categoryId, color } = action.payload;
      const category = state.categories.find((cat) => cat._id === categoryId);
      if (category) {
        for (const word of category.mountain_contents) {
          if (!word.colors) word.colors = {};
          word.colors[new Date().toISOString()] = color;
        }
        // Sync selectedWordData if it belongs to this category
        if (state.selectedWordData) {
          const isWordInCat = category.mountain_contents.some(
            (w) => w._id === state.selectedWordData._id,
          );
          if (isWordInCat) {
            state.selectedWordData.colors = {
              ...state.selectedWordData.colors,
              [new Date().toISOString()]: color,
            };
          }
        }
      }
    },
  },
});

export const {
  setSelectedId,
  setIsModalOpen,
  setSelectedWordData,
  setCenterDefinition,
  setPrevDayColor,
  setDefinitionOnNavigate,
  moveSelection,
  setCategories,
  setNote,
  setShowFilter,
  setOrderFilter,
  setCurrentPage,
  setIsColorBlindMode,
  setIsControlOptionOpen,
  setAutoMoveMakingGreen,
  setWordColor,
  setCategoryColors,
} = mountainControlSlice.actions;

export default mountainControlSlice.reducer;
