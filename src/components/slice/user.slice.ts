import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";

interface UserState {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: string;
}

const initialState: UserState = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  updatedAt: "",
  createdAt: "",
  deletedAt: "",
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

    changeName: (state, action: PayloadAction<number>) => {
      state.firstName += action.payload;
    },
  },
});

export const { authenticate, changeName } = UserSlice.actions;

export const selectCount = (state: RootState) => state.user;

export type { UserState };
export default UserSlice.reducer;
