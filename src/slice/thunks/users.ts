import CONFIG from "../config";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const authenticateUser = createAsyncThunk(
  "user/authenticate",
  async () => {
    const response = await axios.post(
      `${CONFIG.BASE_URL}${CONFIG.AUTHENTICATION}`,
      {
        email: CONFIG.EMAIL,
      }
    );
    return response.data;
  }
);
