import CONFIG from "../config";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

type TCreateRequestMessagePayload = {
  authId: string;
  text: string;
  threadId: string;
  displayName: string;
};
type TUpdateRequestMessagePayload = {
  authId: string;
  messageId: string;
  message: string;
};
type TDeleteRequestMessagePayload = {
  authId: string;
  messageId: string;
};

export const createMessage = createAsyncThunk(
  "messages/create",
  async (request: TCreateRequestMessagePayload) => {
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

export const updateMessage = createAsyncThunk(
  "messages/update",
  async (request: TUpdateRequestMessagePayload) => {
    const { message, authId, messageId } = request;
    const response = await axios.patch(
      `${CONFIG.BASE_URL}${CONFIG.MESSAGES}` + messageId,
      {
        text: message,
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

export const deleteMessage = createAsyncThunk(
  "messages/delete",
  async (request: TDeleteRequestMessagePayload) => {
    const { authId, messageId } = request;
    const response = await axios.delete(
      `${CONFIG.BASE_URL}${CONFIG.MESSAGES}` + messageId,
      {
        headers: {
          Authorization: authId,
        },
      }
    );
    return response.data;
  }
);
