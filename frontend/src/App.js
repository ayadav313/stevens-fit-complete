import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './components/landingPage/LandingPage';
import LoginSignUpPage from './components/loginSignUpPage/LoginSignUpPage';
import Dashboard from './components/dashboard/Dashboard';
import ExerciseCatalog from './components/exerciseCatalog/ExerciseCatalog';

import WorkoutCatalog from './components/workoutCatalog/WorkoutCatalog';
import WorkoutTracker from './components/workoutTracker/WorkoutTracker';
import WorkoutHistory from './components/workoutHistory/WorkoutHistory';

import WorkoutCreate from './components/workoutCreate/WorkoutCreate';
// import SocialPlatform from './components/socialPlatform/SocialPlatform';
// import Calendar from './components/calendar/Calendar';

import { Navigate } from 'react-router-dom';


import './index.scss';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(window.localStorage.getItem('user'));

  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const user = JSON.parse(window.localStorage.getItem('user'));
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginSignUpPage /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/exercise-catalog" element={<PrivateRoute><ExerciseCatalog /></PrivateRoute>} />
          <Route path="/workout-catalog" element={<PrivateRoute><WorkoutCatalog /></PrivateRoute>} />
          <Route path="/workout-tracker" element={<PrivateRoute><WorkoutTracker /></PrivateRoute>} />
          <Route path="/workout-history" element={<PrivateRoute><WorkoutHistory /></PrivateRoute>} />
          <Route path="/workout-create" element={<PrivateRoute><WorkoutCreate /></PrivateRoute>} />
          {/* />
          /> */}
          {/* <Route path="/social-platform" component={SocialPlatform} />
          <Route path="/calendar" component={Calendar} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
