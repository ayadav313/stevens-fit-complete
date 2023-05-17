import React, { useState, useEffect } from 'react';
import Exercise from '../common/Exercise';
import Workout from '../common/Workout';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

import './WorkoutHistory.scss';

const WorkoutLog = ({ exerciseLog }) => {
  return (
    <div className="workout-log">
      <p>
        <strong>Sets:</strong> {exerciseLog.sets}
      </p>
      <p>
        <strong>Reps:</strong> {exerciseLog.reps}
      </p>
    </div>
  );
};

const WorkoutHistoryItem = ({ log }) => {
  const date = new Date(log.date).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const [exercises, setExercises] = useState({});

  useEffect(() => {
    const fetchExercises = async () => {
      const exerciseData = {};
      for (const exerciseLog of log.exerciseLogs) {
        const response = await fetch(`http://localhost:3000/exercises/${exerciseLog.exerciseId}`);
        const data = await response.json();
        exerciseData[exerciseLog.exerciseId] = data;
      }
      setExercises(exerciseData);
    };
  
    fetchExercises();
  }, [log.exerciseLogs]);

  const exerciseList = log.exerciseLogs.map((exercise, index) => {
    const exerciseData = exercises[exercise.exerciseId];
    return (
      <ListItem key={index} disablePadding>
        <div className="exercise-log-item">
          {exerciseData ? (
            <>
              <Exercise
                exercise={{
                  ...exerciseData,
                  target: exerciseData.target,
                  bodyPart: exerciseData.bodyPart,
                  equipment: exerciseData.equipment,
                  gifUrl: exerciseData.gifUrl,
                }}
              />
              <WorkoutLog exerciseLog={exercise} />
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </ListItem>
    );
  });

  return (
    <Card className="container mb-3">
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
            {date}
          </Typography>
        <div className="row">
        <div className="col md-6" >
            <Workout workout={log} />
          </div>
        <div className="col md-6">
            <List>{exerciseList}</List>
          </div>


        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutHistoryItem;
