/**
  MongoDB Collection Management
  This module exports functions to access MongoDB collections.
  It takes advantage of the 'mongoConnection.js' module to establish and manage connections.
  The getCollectionFn function is used to create and cache collection instances for reuse.
  Exported collections can be imported and used in other modules as needed.
  @module mongoCollections
  @version 1.0.0
  @since 2023-04-01
*/

import { dbConnection } from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);

    }

    return _col;
  };
};

export const users = getCollectionFn('users');
export const exercises = getCollectionFn('exercises');
export const workouts = getCollectionFn('workouts');
export const workoutLogs = getCollectionFn('workoutLogs');


