//routes/index.js

import exerciseRoutes from './exercises.js';
import userRoutes from './users.js';
import workoutLogsRoutes from './workoutLogs.js';
import workoutsRouter from './workouts.js';

const constructorMethod = (app) => {
  app.use('/exercises', exerciseRoutes);
  app.use('/users', userRoutes);
  app.use('/workouts', workoutsRouter);
  app.use('/workoutLogs', workoutLogsRoutes);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;
