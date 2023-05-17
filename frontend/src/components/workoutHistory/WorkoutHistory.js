import React, { useState, useEffect } from 'react';
import './WorkoutHistory.scss';

import WorkoutHistoryItem from './WorkoutHistoryItem';

const WorkoutHistory = () => {
  const [workoutLogs, setWorkoutLogs] = useState([]);

  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      try {

        const user = JSON.parse(window.localStorage.getItem('user'));
        const userId = user._id;
        // TODO:  CALL API /WORKOUTLOGS/{USER ID} NOT ALL WORKOUT LOGS
        const response = await fetch(`http://localhost:3000/workoutLogs/user/${userId}`);
        if(response.status === 200){
          const data = await response.json();
          console.log(data);
          setWorkoutLogs(data);
        }
        
      } catch (error) {
        console.error('Failed to fetch workout logs:', error);
      }
    };

    fetchWorkoutLogs();
  }, []);

  let notFoundDiv;
  if(workoutLogs.length ===0){
    notFoundDiv = <div>No Workout history found</div>
  }

  return (
    
    <div className="workout-history container mt-5">
      {workoutLogs.map((log) => (
        <WorkoutHistoryItem key={log._id} log={log} />
      ))}
      {notFoundDiv}
    </div>
  );
};

export default WorkoutHistory;
