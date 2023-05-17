import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.scss';

const LandingPage = () => {
  return (
    <div className="landing-page container-fluid">
      <header className="mb-5 text-center">
        <h1 className="display-1">Stevens FIT</h1>
        <p className="lead">Your Fitness Companion</p>
      </header>

      <div className="row gx-5 gy-5 justify-content-center">
        <div className="col-12 col-md-4">
          <div className="card feature-card text-center">
            <i className="fa fa-cogs fa-3x mb-3"></i>
            <h2>Customized Workout Plans</h2>
            <p>Get workout plans tailored to the equipment available at the UCC gym.</p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card feature-card text-center">
            <i className="fa fa-line-chart fa-3x mb-3"></i>
            <h2>Track Your Progress</h2>
            <p>Keep track of your exercises, sets, reps, and weight to monitor your progress over time.</p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card feature-card text-center">
            <i className="fa fa-users fa-3x mb-3"></i>
            <h2>Connect with Gym Buddies</h2>
            <p>Stay motivated by connecting with your friends and coordinating workouts together.</p>
          </div>
        </div>

        <div className="col-12 text-center mt-4">
          <Link to="/login" className="btn btn-primary btn-lg">
            <i className="fa fa-sign-in mr-2"></i> Get started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
