import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, selectAllUsers } from "../features/users/UserSlice";
import {
  fetchSlots,
  selectAllSlots,
  bookSlot,
} from "../features/slots/SlotSlice";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../app/store";

const CoachDetail: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { coachId } = useParams<{ coachId: string }>();
  const users = useSelector(selectAllUsers);
  const slots = useSelector(selectAllSlots);
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchSlots());
  }, [dispatch]);

  if (!coachId) {
    return <div>Invalid coach ID</div>;
  }

  const coach = users.find((user) => user.id === parseInt(coachId));
  const availableSlots = slots.filter(
    (slot) => slot.coach_id === coach?.id && !slot.is_booked
  );

  if (!coach) {
    return <div>Loading...</div>;
  }

  const handleBookSlot = (slotId: number) => {
    if (currentUser) {
      dispatch(bookSlot({ slotId, studentId: currentUser.id }));
    }
  };

  return (
    <div>
      <h2>{coach.name}</h2>
      <h3>Available Slots</h3>
      <ul>
        {availableSlots.map((slot) => (
          <li key={slot.id}>
            <span>{new Date(slot.start_time).toLocaleString()}</span>
            <button onClick={() => handleBookSlot(slot.id)}>Book</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoachDetail;
