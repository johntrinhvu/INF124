import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../../components/Header/Header.jsx";
import Landing from "../Landing/Landing.jsx";
import SignIn from "../SignIn/SignIn.jsx";
import SignUp from "../SignUp/SignUp.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import Profile from "../Profile/Profile.jsx";
import FAQ from "../FAQ/FAQ.jsx";
import Settings from "../Settings/Settings.jsx";
import Quiz from "../Quiz/Quiz.jsx";
import Course from "../Course/Course.jsx";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/')
    .then(res => setMessage(res.data.msg))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile/:username" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/faq" element={<FAQ/>} />
          <Route path="/profile/:username/settings" element={
            <ProtectedRoute>
              <Settings/>
            </ProtectedRoute>
          } />
          <Route path="/quiz" element={
            <ProtectedRoute>
              <Quiz/>
            </ProtectedRoute>
          } />
          <Route path="/course" element={
            <ProtectedRoute>
              <Course />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </div>
  );
};

