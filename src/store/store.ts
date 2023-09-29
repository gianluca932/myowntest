import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../components/slice/user.slice";
import threadsSlice from "../components/slice/threads.slice";

const store = configureStore({
  reducer: {
    user: userSlice,
    threads: threadsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
