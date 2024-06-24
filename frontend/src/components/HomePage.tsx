import React from "react";
import { useSelector } from "react-redux";
import { getCurrentUser } from "../features/users/UserSlice";
import StudentHomePage from "./StudentHomePage";
import CoachHomePage from "./CoachHomePage";
import { RootState } from "../app/store";

const HomePage: React.FC = () => {
  const currentUser = useSelector(getCurrentUser);
  const userStatus = useSelector((state: RootState) => state.users.status);

  if (userStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <div>No user available</div>;
  }

  return (
    <div>
      <h1>Welcome, {currentUser.name}</h1>
      {currentUser.role === "coach" ? <CoachHomePage /> : <StudentHomePage />}
    </div>
  );
};

export default HomePage;
