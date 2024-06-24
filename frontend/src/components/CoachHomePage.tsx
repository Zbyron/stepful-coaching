import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCalls, selectAllCalls } from "../features/calls/CallSlice";
import {
  fetchSlots,
  selectAllSlots,
  deleteSlot,
} from "../features/slots/SlotSlice";
import { RootState, AppDispatch } from "../app/store";
import AddSlotModal from "./AddSlotModal";

const CoachHomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  const calls = useSelector(selectAllCalls).filter(
    (call) => call.coach_id === currentUser?.id
  );
  const slots = useSelector(selectAllSlots).filter(
    (slot) => slot.coach_id === currentUser?.id
  );

  useEffect(() => {
    if (currentUser?.role === "coach") {
      dispatch(fetchCalls());
      dispatch(fetchSlots());
    }
  }, [dispatch, currentUser]);

  const availableSlots = slots.filter((slot) => !slot.is_booked);
  const upcomingSlots = slots.filter((slot) => slot.is_booked).slice(0, 5);
  const pendingReviews = calls.filter((call) => call.satisfaction === null);

  const handleAddSlotClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setShowModal(true);
  };

  const handleDeleteSlot = (slotId: number) => {
    dispatch(deleteSlot(slotId));
  };

  return (
    <div>
      <h2>Available Slots</h2>
      <ul>
        {availableSlots.map((slot) => (
          <li key={slot.id}>
            <span>{new Date(slot.start_time).toLocaleString()}</span>
            <div className="burger-menu">
              <button>Edit</button>
              <button onClick={() => handleDeleteSlot(slot.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <h2>Upcoming Slots</h2>
      <ul>
        {upcomingSlots.map((slot) => {
          const call = calls.find((call) => call.slot_id === slot.id);
          return (
            <li key={slot.id}>
              <span>
                {new Date(slot.start_time).toLocaleString()} -{" "}
                {slot.student_name} ({slot.student_phone})
              </span>
              <div className="burger-menu">
                <button>Edit</button>
                <button onClick={() => handleDeleteSlot(slot.id)}>
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <h2>Pending Reviews</h2>
      <ul>
        {pendingReviews.map((call) => (
          <li key={call.id}>
            <span>{new Date(call.created_at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
      <button type="button" onClick={handleAddSlotClick}>
        Add Slot
      </button>
      {showModal && <AddSlotModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default CoachHomePage;
