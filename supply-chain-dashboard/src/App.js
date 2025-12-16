// App.js (adjusted)
import React from "react";
import Dashboard from "./components/dashboard/dashboard";
import Navbar from "./components/navbar/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoothPage from "./components/booths/booth-page/booth-page";
import LogInPage from "./components/signout/LogInPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      {/* optional: show navbar only when logged in */}
      {/* <Navbar /> */}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booth/:id"
          element={
            <ProtectedRoute>
              <BoothPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LogInPage />} />
      </Routes>
    </Router>
  );
}

export default App;
