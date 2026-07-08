import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./features/form/formSlice.js";
import chatReducer from "./features/chat/chatSlice.js";

export const store = configureStore({
  reducer: {
    form: formReducer,
    chat: chatReducer,
  },
});
