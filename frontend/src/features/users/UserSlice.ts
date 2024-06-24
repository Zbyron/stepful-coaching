import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";

export interface User {
  id: number;
  name: string;
  role: "coach" | "student";
  phone_number: string;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: JSON.parse(localStorage.getItem("currentUser") || "null"),
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get<User[]>("http://localhost:3000/users");
  return response.data;
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export const selectAllUsers = (state: RootState) => state.users.users;
export const getCurrentUser = (state: RootState) => state.users.currentUser;
export const getUsersStatus = (state: RootState) => state.users.status;
export const getUsersError = (state: RootState) => state.users.error;

export default userSlice.reducer;
