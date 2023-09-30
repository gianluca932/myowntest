import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { TThreads } from "../types";
const initialState: TThreads[] = [];

export const ThreadsSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    loadAllThreads: (state, action: PayloadAction<TThreads[]>) => {
      console.log("Reading All Threads", action.payload);
      state = action.payload;
      return state;
    },
    loadSingleThread: (state, action: PayloadAction<TThreads>) => {
      console.log("Reading Single Thread", action.payload);

      const index = state.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        /* it's already in the state, so update it */
        state[index] = { ...state[index], ...action.payload };
      } else {
        /* it's not in the state, so add it */
        state.push(action.payload);
      }

      return state;
    },
  },
});

export const { loadAllThreads, loadSingleThread } = ThreadsSlice.actions;

export const selectCount = (state: RootState) => state.threads;

export default ThreadsSlice.reducer;
