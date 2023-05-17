import { closeConnection } from '../config/mongoConnection.js';
import {createUser, getAllUsers} from '../data/users.js';
import workoutMethods from '../data/workouts.js';

export const seedSampleDatabase = async () => {

  try {
    console.log('Seeding database with users and workouts');

    // Example users
    const users = [
      {
        username: 'user1',
        password: 'password1',
        email: 'user1@example.com',
      },
      {
        username: 'user2',
        password: 'password2',
        email: 'user2@example.com',
      },
    ];

    // Example workouts
    const workouts = [
      {
        name: 'Workout 1',
        creator: '',
        exercises: [
          {
            exerciseId: '643d6a3534a9b6db89fb5d2f',
            sets: "3",
            reps: "10",
            additionalDetails: 'Example details',
          },
          {
            exerciseId: '643d6a3534a9b6db89fb5d2f',
            sets: "4",
            reps: "8",
          },
        ],
      },
      {
        name: 'Workout 2',
        creator: '',
        exercises: [
          {
            exerciseId: '643d6a3534a9b6db89fb5d2f',
            sets: "5",
            reps: "5",
          },
        ],
      },
    ];

    // Add users to the database
    for (const user of users) {
      const userId = await createUser(user.username, user.password, user.email);
      console.log(`Added user "${user.username}" with ID "${userId}" successfully!`);
    }

    // Assign creator for workouts
    const allUsers = await getAllUsers();
    workouts[0].creator = allUsers[0]._id.toString();
    workouts[1].creator = allUsers[1]._id.toString()

    // Add workouts to the database
    for (const workout of workouts) {
      const workoutId = await workoutMethods.create(workout.name, workout.creator, workout.exercises);
      console.log(`Added workout "${workout.name}" with ID "${workoutId}" successfully!`);
    }

    console.log('Done seeding database');
    closeConnection();
  } catch (error) {
    console.log(`Error seeding database: ${error.message}`);
    await closeConnection();
  }
};
