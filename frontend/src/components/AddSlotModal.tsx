import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { addSlot } from "../features/slots/SlotSlice";

interface AddSlotModalProps {
  onClose: () => void;
}

const AddSlotModal: React.FC<AddSlotModalProps> = ({ onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );

  const [startTime, setStartTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentUser) {
      setIsSubmitting(true);

      // Calculate end time as 2 hours after start time
      const startDateTime = new Date(startTime);
      const endDateTime = new Date(
        startDateTime.getTime() + 2 * 60 * 60 * 1000
      );

      dispatch(
        addSlot({
          coach_id: currentUser.id,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
        })
      ).then(() => {
        setIsSubmitting(false);
        onClose();
      });
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button type="button" className="close" onClick={onClose}>
          &times;
        </button>
        <h2>Add Slot</h2>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="start_time">Start Time:</label>
            <input
              type="datetime-local"
              id="start_time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            Add Slot
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSlotModal;
