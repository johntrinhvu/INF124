import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Quiz from '../Quiz/Quiz';
import SignUp from '../SignUp/SignUp';
import Profile from '../Profile/Profile';
import Landing from '../Landing/Landing';
import SignIn from '../SignIn/SignIn';
import SignUpSuccess from '../SignUpSuccess/SignUpSuccess';
import FAQ from '../FAQ/FAQ';
import Settings from '../Settings/Settings';
import Course from '../Course/Course';
import Header from '../../components/Header/Header';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';

function App() {
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
                            <Settings />
                        </ProtectedRoute>
                    } />
                    <Route path="/quizzes/:courseTitle" element={
                        <ProtectedRoute>
                            <Quiz />
                        </ProtectedRoute>
                    } />
                    <Route path="/courses/:courseTitle" element={
                        <ProtectedRoute>
                            <Course />
                        </ProtectedRoute>
                    } />
                    <Route path="/signup-success" element={<SignUpSuccess />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;

