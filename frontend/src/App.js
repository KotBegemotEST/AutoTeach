import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GroupList from "./components/GroupList";
import StudentTable from "./components/StudentTable";
import LoginComponent from "./components/LoginComponent";
import SubjDiary from "./pages/SubjDiary";
import AddLessonModal from "./components/AddLessonModal";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import StatisticsPage from "./pages/StatisticsPage";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅

import './styles/global.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setInitializing(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (initializing) {
    return <div>⏳ Laen rakendust...</div>;
  }

  return (
    <Router>
      {user && <Header user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<LoginComponent setUser={setUser} />} />

        <Route path="/dashboard" element={
          <ProtectedRoute user={user}>
            <Dashboard key={user?.id} />
          </ProtectedRoute>
        } />

        <Route path="/login" element={
          <ProtectedRoute user={user}>
            <Dashboard key={user?.id} />
          </ProtectedRoute>
        } />

        <Route path="/group/:id" element={
          <ProtectedRoute user={user}>
            <StudentTable />
          </ProtectedRoute>
        } />

        <Route path="/diary/:groupId" element={
          <ProtectedRoute user={user}>
            <SubjDiary user={user} />
          </ProtectedRoute>
        } />

        <Route path="/group/:groupId/subject/:subjectId" element={
          <ProtectedRoute user={user}>
            <SubjDiary user={user} />
          </ProtectedRoute>
        } />

        <Route path="/statistics/:studentId/:subjectId" element={
          <ProtectedRoute user={user}>
            <StatisticsPage />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </Router>
  );
};
export default App;
