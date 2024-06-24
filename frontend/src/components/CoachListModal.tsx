import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, selectAllUsers } from "../features/users/UserSlice";
import {
  fetchSlots,
  selectAllSlots,
  bookSlot,
} from "../features/slots/SlotSlice";
import { AppDispatch, RootState } from "../app/store";

interface CoachListModalProps {
  onClose: () => void;
}

const CoachListModal: React.FC<CoachListModalProps> = ({ onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector(selectAllUsers).filter(
    (user) => user.role === "coach"
  );
  const slots = useSelector(selectAllSlots);
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );

  const [dataFetched, setDataFetched] = useState(false);

  //   useEffect(() => {
  //     if (!dataFetched) {
  //       console.log('Fetching users and slots');
  //       dispatch(fetchUsers()).then(() => console.log('Users fetched'));
  //       dispatch(fetchSlots()).then(() => console.log('Slots fetched'));
  //       setDataFetched(true);
  //     }
  //   }, [dataFetched, dispatch]);

  const handleModalClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onClose();
  };

  const handleBookSlot = (
    slotId: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentUser) {
      dispatch(bookSlot({ slotId, studentId: currentUser.id }));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button type="button" className="close" onClick={handleModalClose}>
          &times;
        </button>
        <h2>Available Coaches</h2>
        <ul>
          {users.map((coach) => (
            <li key={coach.id}>
              <h3>{coach.name}</h3>
              <ul>
                {slots
                  .filter(
                    (slot) => slot.coach_id === coach.id && !slot.is_booked
                  )
                  .slice(0, 3)
                  .map((slot) => (
                    <li key={slot.id}>
                      <span>{new Date(slot.start_time).toLocaleString()}</span>
                      <button
                        type="button"
                        onClick={(e) => handleBookSlot(slot.id, e)}
                      >
                        Book
                      </button>
                    </li>
                  ))}
              </ul>
              <a
                href={`/coach/${coach.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                View Details
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CoachListModal;
