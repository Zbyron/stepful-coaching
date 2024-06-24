import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";

interface Slot {
  id: number;
  coach_id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  student_id?: number;
  student_name?: string;
  student_phone?: string;
  coach_name?: string;
  coach_phone?: string;
}

interface SlotState {
  slots: Slot[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SlotState = {
  slots: [],
  status: "idle",
  error: null,
};

export const fetchSlots = createAsyncThunk("slots/fetchSlots", async () => {
  const response = await axios.get<Slot[]>("http://localhost:3000/slots");
  return response.data;
});

export const addSlot = createAsyncThunk(
  "slots/addSlot",
  async (slotData: Omit<Slot, "id" | "is_booked" | "student_id">) => {
    const response = await axios.post<Slot>(
      "http://localhost:3000/slots",
      slotData
    );
    return response.data;
  }
);

export const deleteSlot = createAsyncThunk(
  "slots/deleteSlot",
  async (slotId: number) => {
    await axios.delete(`http://localhost:3000/slots/${slotId}`);
    return slotId;
  }
);

export const bookSlot = createAsyncThunk(
  "slots/bookSlot",
  async ({ slotId, studentId }: { slotId: number; studentId: number }) => {
    const response = await axios.patch<Slot>(
      `http://localhost:3000/slots/${slotId}/book`,
      { student_id: studentId }
    );
    return response.data;
  }
);

const slotSlice = createSlice({
  name: "slots",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSlots.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSlots.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.slots = action.payload;
      })
      .addCase(fetchSlots.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch slots";
      })
      .addCase(addSlot.fulfilled, (state, action) => {
        state.slots.push(action.payload);
      })
      .addCase(deleteSlot.fulfilled, (state, action) => {
        state.slots = state.slots.filter((slot) => slot.id !== action.payload);
      })
      .addCase(bookSlot.fulfilled, (state, action) => {
        const updatedSlot = action.payload;
        const existingSlot = state.slots.find(
          (slot) => slot.id === updatedSlot.id
        );
        if (existingSlot) {
          existingSlot.is_booked = true;
          existingSlot.student_id = updatedSlot.student_id;
          existingSlot.student_name = updatedSlot.student_name;
          existingSlot.student_phone = updatedSlot.student_phone;
        }
      });
  },
});

export const selectAllSlots = (state: RootState) => state.slots.slots;
export const getSlotsStatus = (state: RootState) => state.slots.status;
export const getSlotsError = (state: RootState) => state.slots.error;

export default slotSlice.reducer;
