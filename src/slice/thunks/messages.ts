import CONFIG from "../config";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

type TRequestMessagePayload = {
  authId: string;
  text: string;
  threadId: string;
  displayName: string;
};

export const createMessage = createAsyncThunk(
  "messages/create",
  async (request: TRequestMessagePayload) => {
    const { text, authId, displayName, threadId } = request;
    const response = await axios.post(
      `${CONFIG.BASE_URL}${CONFIG.MESSAGES_NEW}`,
      {
        text,
        threadId,
        displayName,
        checkSum: "123",
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
