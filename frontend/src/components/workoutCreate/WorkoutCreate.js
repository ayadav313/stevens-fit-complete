import React, { useState, useEffect } from 'react';
import ExerciseInput from './ExerciseInput';
import './WorkoutCreate.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const WorkoutCreate = () => {
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);
  const [exerciseInputs, setExerciseInputs] = useState([{ id: 0, selectedExercise: '', sets: '', reps: '' }]);
  const [formErrors, setFormErrors] = useState([]);
  const [workoutName, setWorkoutName] = useState('');

  const navigate = useNavigate();

  const fetchExercises = async () => {
    try {
      const response = await fetch('http://localhost:3000/exercises');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const addExerciseInput = () => {
    setExerciseInputs([...exerciseInputs, { id: exerciseInputs.length, selectedExercise: '', sets: '', reps: '' }]);
  };

  const delExerciseInput = () => {
    // Remove the last element from the array
    const newInputs = exerciseInputs.slice(0, -1);
    setExerciseInputs(newInputs);
  };
  

  const setExerciseInput = (id, exercise) => {
    setExerciseInputs(exerciseInputs.map((input) => (input.id === id ? exercise : input)));
  };

  const validateForm = () => {
    const errors = [];

    if (workoutName.trim() === '') {
      errors.push('Workout name is required.');
    }

    exerciseInputs.forEach((exercise) => {
      if (exercise.selectedExercise === '') {
        errors.push('Exercise selection is required.');
      }

      if (exercise.sets === '') {
        errors.push('Sets are required.');
      }

      if (exercise.reps === '') {
        errors.push('Reps are required.');
      }
    });

    setFormErrors(errors);
    return errors.length === 0;
  };

  const createWorkout = async () => {
    // console.log(exerciseInputs[0]);

    const exercises = [];
    for(let i = 0; i < exerciseInputs.length; i++){
      const currentExercise = exerciseInputs[i];
      const currentObj = {};
      currentObj.exerciseId = currentExercise.selectedExercise;
      currentObj.sets = currentExercise.sets;
      currentObj.reps = currentExercise.reps;
      currentObj.additionalDetails = currentExercise.notes;
      exercises.push(currentObj);
    }
    const workoutObj = {};
    workoutObj.name = workoutName;
    
    const user = JSON.parse(window.localStorage.getItem('user'));
    workoutObj.creator = user.username;

    workoutObj.exercises = exercises;

    const response = await fetch('http://localhost:3000/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ workoutObj })
    });
    console.log(response);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    navigate('/dashboard');
  }

  // const formData = () => {
  //   const user = JSON.parse(window.localStorage.getItem('user'));
  //   let workout = {
  //     name: workoutName,
  //     creator: user.username,
  //     exercises: exerciseInputs
  //   }
  //   return workout;
  // };


  const handleSubmit = (e) => {
    e.preventDefault();

  

    if (validateForm()) {
      console.log('Form is valid, submit the workout');
      createWorkout();
      navigate('/dashboard');
    }
  };
  return (
    <div className="workout-create container">
      <h3 className="text-center my-5">Create Workout</h3>
      <div className="row justify-content-center mb-3">
        <div className="col-12 col-md-6 col-lg-4">
          <input
            type="text"
            placeholder="Workout name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="form-control mb-3"
          />
          
        </div>
      </div>
      {error && <p className="error-message">Failed to load exercises: {error}</p>}
      <div className="row justify-content-center">
        {exerciseInputs.map((exercise) => (
          <div className="col-12 col-md-6 col-lg-4 mb-3" key={exercise.id}>
            <ExerciseInput
              exerciseOptions={exercises}
              exercise={exercise}
              setExercise={(updatedExercise) => setExerciseInput(exercise.id, updatedExercise)}
            />
          </div>
        ))}
        <div className="col-12 text-center">
        <button className="btn btn-primary btn-sm" onClick={addExerciseInput}>
            Add Exercise
          </button>
          <button className="btn btn-primary btn-sm" onClick={delExerciseInput}>
            Delete Exercise
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
            Submit Workout
          </button>
          
        </div>
      </div>
      {formErrors.length > 0 && (
        <ul className="error-message">
          {formErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default WorkoutCreate;
