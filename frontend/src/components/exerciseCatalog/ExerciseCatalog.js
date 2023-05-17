import React, { useState, useEffect } from 'react';
import './ExerciseCatalog.scss';
import Exercise from '../common/Exercise'

const ExerciseCatalog = () => {
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [session, setSession] = useState('');

  const fetchExercises = async () => {
    try {
      // const response = await fetch('http://localhost:3000/exercises');
      const response = await fetch('http://localhost:3000/exercises', {
        credentials: "include",
        session: session
      });
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


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.bodyPart.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="exercise-catalog container-fluid">
      <h3 className="text-center mb-3">Exercise Catalog</h3>
      <div className="row justify-content-center mb-3">
        <div className="col-12 col-md-6 col-lg-4">
        <input
            type="text"
            placeholder="Search by name, body part, target, or equipment"
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control"
          />
        </div>
      </div>
      {error ? (
        <p className="error-message">Failed to load exercises: {error}</p>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredExercises.map((exercise) => (
            <div key={exercise._id} className="col">
              <Exercise exercise={exercise} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseCatalog;
