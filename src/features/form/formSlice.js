import { createSlice } from "@reduxjs/toolkit";

// The form is agent-owned. The user never writes here directly; the only mutation is
// `setForm`, dispatched with the form returned by the backend after each chat turn.
const initialState = {
  hcp_name: "",
  interaction_type: "Meeting",
  date: "",
  time: "",
  attendees: [],
  topics_discussed: "",
  sentiment: "",
  materials_shared: [],
  follow_up: null,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setForm: (_state, action) => ({ ...initialState, ...action.payload }),
    resetForm: () => initialState,
  },
});

export const { setForm, resetForm } = formSlice.actions;
export default formSlice.reducer;
