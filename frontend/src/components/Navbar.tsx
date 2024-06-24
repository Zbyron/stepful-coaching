import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { fetchUsers, setCurrentUser, User } from "../features/users/UserSlice";

const Navbar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  const userStatus = useSelector((state: RootState) => state.users.status);

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  const handleToggleUser = () => {
    if (users.length > 0) {
      const newRole = currentUser?.role === "coach" ? "student" : "coach";
      const newUser = users.find((user) => user.role === newRole);
      if (newUser) {
        dispatch(setCurrentUser(newUser));
      }
    }
  };

  return (
    <nav>
      <section>
        <h1>Stepful Coaching</h1>
        <div className="navContent">
          <button onClick={handleToggleUser}>
            Switch to {currentUser?.role === "coach" ? "Student" : "Coach"}
          </button>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
