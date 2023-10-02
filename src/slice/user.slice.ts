import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { UserState } from "../types";
import { authenticateUser } from "./thunks/users";

const initialState: UserState = {
  user: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    updatedAt: "",
    createdAt: "",
    deletedAt: "",
  },
  status: "idle",
  error: undefined,
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authenticate: (state, action: PayloadAction<UserState>) => {
      console.log("authenticatinfg user", action.payload);
      state = action.payload;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getUser = (state: RootState) => state.user.user;
export const getUserStatus = (state: RootState) => state.user.status;
export const getUserError = (state: RootState) => state.user.error;

export type { UserState };
export default UserSlice.reducer;
