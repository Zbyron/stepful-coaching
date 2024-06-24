import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCalls, selectAllCalls } from "../features/calls/CallSlice";
import { fetchSlots, selectAllSlots } from "../features/slots/SlotSlice";
import { RootState, AppDispatch } from "../app/store";
import CoachListModal from "./CoachListModal";

const StudentHomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  const calls = useSelector(selectAllCalls).filter(
    (call) => call.student_id === currentUser?.id
  );
  const slots = useSelector(selectAllSlots);

  useEffect(() => {
    if (currentUser?.role === "student") {
      dispatch(fetchCalls());
      dispatch(fetchSlots());
    }
  }, [dispatch, currentUser]);

  const upcomingCalls = calls.slice(0, 5);

  const handleFindCoachClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setShowModal(true);
  };

  return (
    <div>
      <h2>Upcoming Calls</h2>
      <ul>
        {upcomingCalls.map((call) => {
          const slot = slots.find((slot) => slot.id === call.slot_id);
          return (
            <li key={call.id}>
              <span>
                {new Date(slot?.start_time || call.created_at).toLocaleString()}{" "}
                - Coach {call.coach_name} ({call.coach_phone})
              </span>
              <div className="burger-menu">
                <button type="button">Details</button>
                <button type="button">Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={handleFindCoachClick}>
        Find a Coach
      </button>
      {showModal && <CoachListModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default StudentHomePage;
