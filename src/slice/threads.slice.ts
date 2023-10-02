import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { TThreads } from "../types";
import { createThread, readAllThread, readThread } from "./thunks/threads";
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(readAllThread.pending, () => {
        console.log("Reading All Threads");
      })
      .addCase(readAllThread.fulfilled, (state, action) => {
        console.log("Reading All Threads", action.payload);
        state = action.payload;
        return state;
      })
      .addCase(readAllThread.rejected, (state, action) => {
        console.log("Reading All Threads Error", action.payload);
        return state;
      })
      .addCase(readThread.pending, () => {
        console.log("Reading Single Thread");
      })
      .addCase(readThread.fulfilled, (state, action) => {
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
      })
      .addCase(readThread.rejected, (state, action) => {
        console.log("Reading Single Thread Error", action.payload);
        return state;
      })
      .addCase(createThread.pending, () => {
        console.log("Creating Thread");
      })
      .addCase(createThread.fulfilled, (state, action) => {
        console.log("Creating Thread", action.payload);
        return state;
      });
  },
});

export const { loadAllThreads } = ThreadsSlice.actions;

export const getAllThreads = (state: RootState) => state.threads;
export const getSingleThreads = (state: RootState) => state.threads;

export const selectCount = (state: RootState) => state.threads;

export default ThreadsSlice.reducer;
