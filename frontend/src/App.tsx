import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import CoachDetail from "./components/CoachDetail";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/coach/:coachId" element={<CoachDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
