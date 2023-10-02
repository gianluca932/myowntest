import CONFIG from "../config";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

type TRequestPayload = {
  authId: string;
  title?: string;
  id?: string;
};

export const createThread = createAsyncThunk(
  "threads/create",
  async (request: TRequestPayload) => {
    const { title, authId } = request;
    const response = await axios.post(
      `${CONFIG.BASE_URL}${CONFIG.THREADS_NEW}`,
      {
        title,
      },
      {
        headers: {
          Authorization: authId,
        },
      }
    );
    return response.data;
  }
);
export const readThread = createAsyncThunk(
  "threads/read",
  async (request: TRequestPayload) => {
    const { id, authId } = request;

    const response = await axios.get(
      `${CONFIG.BASE_URL}${CONFIG.THREADS}` + id,
      {
        headers: {
          Authorization: authId,
        },
      }
    );
    return response.data;
  }
);
export const readAllThread = createAsyncThunk(
  "threads/readAll",
  async (request: TRequestPayload) => {
    const { authId } = request;

    const response = await axios.get(`${CONFIG.BASE_URL}${CONFIG.THREADS}`, {
      headers: {
        Authorization: authId,
      },
    });
    return response.data;
  }
);
