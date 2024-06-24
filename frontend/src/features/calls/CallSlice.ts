import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";

interface Call {
  id: number;
  slot_id: number;
  coach_id: number;
  student_id: number;
  satisfaction: number | null;
  notes: string;
  created_at: string;
  student_name?: string;
  student_phone?: string;
  coach_name?: string;
  coach_phone?: string;
}

interface CallState {
  calls: Call[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CallState = {
  calls: [],
  status: "idle",
  error: null,
};

export const fetchCalls = createAsyncThunk("calls/fetchCalls", async () => {
  const response = await axios.get<Call[]>("http://localhost:3000/calls");
  return response.data;
});

const callSlice = createSlice({
  name: "calls",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalls.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCalls.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.calls = action.payload;
      })
      .addCase(fetchCalls.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch calls";
      });
  },
});

export const selectAllCalls = (state: RootState) => state.calls.calls;
export const getCallsStatus = (state: RootState) => state.calls.status;
export const getCallsError = (state: RootState) => state.calls.error;

export default callSlice.reducer;
