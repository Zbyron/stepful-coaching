import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/users/UserSlice";
import slotReducer from "../features/slots/SlotSlice";
import callReducer from "../features/calls/CallSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    slots: slotReducer,
    calls: callReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
