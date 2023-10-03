import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { TThreads } from "../types";
import { createThread, readAllThread, readThread } from "./thunks/threads";
import { updateMessage } from "./thunks/messages";
const initialState: TThreads[] = [];

export const ThreadsSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    loadAllThreads: (state, action: PayloadAction<TThreads[]>) => {
      state = action.payload;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readAllThread.pending, () => {})
      .addCase(readAllThread.fulfilled, (state, action) => {
        state = action.payload;
        return state;
      })
      .addCase(readAllThread.rejected, (state, action) => {
        return state;
      })
      .addCase(readThread.pending, () => {})
      .addCase(readThread.fulfilled, (state, action) => {
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
        return state;
      })
      .addCase(createThread.pending, () => {})
      .addCase(createThread.fulfilled, (state, action) => {
        return state;
      })
      .addCase(updateMessage.pending, () => {})
      .addCase(updateMessage.fulfilled, (state, action) => {
        return state;
      })
      .addCase(updateMessage.rejected, (state, action) => {
        return state;
      });
  },
});

export const { loadAllThreads } = ThreadsSlice.actions;

export const getAllThreads = (state: RootState) => state.threads;
export const getSingleThreads = (state: RootState) => state.threads;

export const selectCount = (state: RootState) => state.threads;

export default ThreadsSlice.reducer;
