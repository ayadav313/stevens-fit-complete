  import React, { useState, useEffect } from 'react';
  import { useLocation } from 'react-router-dom';
  import { useNavigate } from 'react-router-dom';
  import Exercise from '../common/Exercise';
  import Workout from '../common/Workout';

  const WorkoutTracker = () => {
    const location = useLocation();
    const workoutData = location.state ? location.state.workoutData : null;
    const [workout, setWorkout] = useState(null);
    const navigate = useNavigate();

    const [exercises, setExercises] = useState({});

    useEffect(() => {
      if (workoutData) {
        setWorkout(workoutData);
      }
    }, [workoutData]);

    useEffect(() => {
      const fetchExercises = async () => {
        const exerciseData = {};
        for (const exerciseLog of workout.exerciseLogs) {
          const response = await fetch(`http://localhost:3000/exercises/${exerciseLog.exerciseId}`);
          const data = await response.json();
          exerciseData[exerciseLog.exerciseId] = data;
        }
        setExercises(exerciseData);
      };
    
      if (workout) {
        fetchExercises();
      }
    }, [workout]);
    

    const [exerciseLogs, setExerciseLogs] = useState([]);

    const handleSetReps = (exerciseId, sets, reps) => {
      setExerciseLogs((prevState) => [
        ...prevState.filter((el) => el.exerciseId !== exerciseId),
        { exerciseId, sets, reps },
      ]);
    };

    const handleSetSets = (exerciseId, sets, reps) => {
      setExerciseLogs((prevState) => [
        ...prevState.filter((el) => el.exerciseId !== exerciseId),
        { exerciseId, sets, reps },
      ]);
    };


    const postWorkoutLog = async (userId, workoutId, date, exerciseLogs) => {

      const response = await fetch('http://localhost:3000/workoutLogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, workoutId, date, exerciseLogs }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Failed to save workout log');
      }
    };

    const handleSubmit = async () => {

      if (exerciseLogs.length === 0) {
        alert('Please finish the form!');
        return;
      }
      if (exerciseLogs.length !== workout.exerciseLogs.length) {
        alert('Please finish the form!');
        return;
      }
      
      for (let exercise of exerciseLogs) {
        if (!Number.isInteger(exercise.sets) || exercise.sets <= 0 || !Number.isInteger(exercise.reps) || exercise.reps <= 0) {
          alert('Please enter valid numbers for sets and reps!');
          return;
        }
      }
      


      try {
        const user = JSON.parse(window.localStorage.getItem('user'));
        const log = await postWorkoutLog(user._id, workoutData._id, new Date(), exerciseLogs);
        console.log('Workout saved successfully!', log);
        alert('Workout saved successfully!');
        navigate('/dashboard');
      } catch (e) {
        console.error(e);
        alert('Failed to save workout log');
      }
    };

    if (!workout) {
      return <div>Loading...</div>;
    }

    return (
      <div className="workout-tracker container">
        <h3 className="my-4">{workout.name}</h3>
        {workout.exerciseLogs.map((exercise, idx) => {
    const exerciseData = exercises[exercise.exerciseId];
    return (
      <div key={idx} className="exercise-log card mb-3 p-3">
        {exerciseData ? (
          <>
            <div className="row">
            <div className='col-md-4'>
              
              <div className='row-md-6 mt-3 text-center'>
                <h2 className='mb-4'> Finish {exercise.reps} reps</h2>

                <h2 className='mb-4'>Finish {exercise.sets} sets</h2>

      
              </div>


              </div>

            <div className="col-md-4">
            <div className="input-group mt-3">
            <span className="input-group-text">Reps performed:</span>
            <input
              type="number"
              className="form-control"
              onChange={(e) => {
                const exerciseLog = exerciseLogs.find((el) => el.exerciseId === exercise.exerciseId) || {};
                handleSetReps(exercise.exerciseId, exerciseLog.sets || exercise.sets, Number(e.target.value))
              }}
            />
          </div>
          <div className="input-group mt-3">
            <span className="input-group-text">Sets performed:</span>
            <input
              type="number"
              className="form-control"
              onChange={(e) => {
                const exerciseLog = exerciseLogs.find((el) => el.exerciseId === exercise.exerciseId) || {};
                handleSetSets(exercise.exerciseId, Number(e.target.value), exerciseLog.reps || exercise.reps)
              }}
            />
          </div>
    
            </div>

            <div className="col-md-4">
            <Exercise exercise={exerciseData} />

            </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
        );
      })}
        <button className="btn btn-primary" onClick={handleSubmit}>Submit Workout</button>
      </div>
    );
  };

  export default WorkoutTracker;
