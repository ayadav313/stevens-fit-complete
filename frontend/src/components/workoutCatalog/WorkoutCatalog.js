import React, { useState, useEffect } from 'react';
import './WorkoutCatalog.scss';
import Workout from '../common/Workout'

const WorkoutCatalog = () => {

  //state vars
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('http://localhost:3000/workouts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      setWorkouts(data);
      setIsLoading(false);

    } catch (error) {
      console.error('Failed to fetch workouts:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <div className="workout-catalog">
      <h3>Workout Catalog</h3>
      {error ? (
        <p className="error-message">Failed to load workouts: {error}</p>
      ) : isLoading ? (
        <p>Loading workouts...</p>
      ) : (
        <div className="workouts-list row row-cols-1 row-cols-md-5 g-4">
          {workouts.map((workout) => (
            <div key={workout._id} className="col">
              <Workout workout={workout} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutCatalog;
