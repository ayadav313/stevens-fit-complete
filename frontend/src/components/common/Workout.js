import './Workout.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Workout = ({ workout }) => {
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

      // Inside the Workout component
      const navigate = useNavigate();
  
      const startWorkout = () => {
        navigate('/workout-tracker', { state: { workoutData: workout } });
      };

      const fetchExercise = async (exerciseId) => {
        try {
          const response = await fetch("http://localhost:3000/exercises/" + exerciseId)
          return response.json();
        } catch (error) {
          console.error('Failed to fetch exercises:', error);
          setError(error.message);
        }

      };
  
  
      useEffect(() => {
      const fetchExercises = async () => {
        if(workout.exerciseLogs)
        {
          const fetchedExercises = await Promise.all(
            workout.exerciseLogs.map(async (log) => await fetchExercise(log.exerciseId))
          );
          setExercises(fetchedExercises);
        }
        setIsLoading(false);

      };
    
      fetchExercises();
    }, [workout.exerciseLogs]);
    
    return (
      <div className="workout-item card">
        <h4 className="card-header">{workout.name}</h4>
        <div className="card-body">
          <h5>Exercises</h5>
            {error ? (
              <p className="error-message">Failed to load exercises: {error}</p>
              ) : isLoading ? (
              <p>Loading exercises...</p>
            ) : (
              <ul className="list-unstyled">
                {exercises.map((exercise, index) => (
                  <li key={index} className="mb-3">
                      <h6>{exercise?.name || 'Exercise name should be here!'}</h6>
                      <p>
                      Sets: <strong>{workout.exerciseLogs[index].sets}</strong>, Reps:{" "}
                      <strong>{workout.exerciseLogs[index].reps}</strong>
                      </p>
                      {workout.exerciseLogs[index].additionalDetails && (
                      <p className="text-muted">
                          <em>{workout.exerciseLogs[index].additionalDetails}</em>
                      </p>
                      )}
                  </li>
                ))}
              </ul>
            )}
          <p> ~ {workout.creator}</p>

          <button className="btn btn-primary" onClick={startWorkout}>
    Start
  </button>
        </div>
      </div>
    );
    
  };

export default Workout;
