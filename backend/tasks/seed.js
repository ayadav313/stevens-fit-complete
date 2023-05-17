import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import fs from 'fs';
import csvParser from 'csv-parser';
import exerciseMethods from '../data/exercises.js';
import { createUser, getAllUsers } from '../data/users.js';
import workoutMethods from '../data/workouts.js';

const seedExercises = async () => {
  const exercises = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream('data.csv')
      .pipe(csvParser())
      .on('data', (row) => {
        const { name, target, bodyPart, equipment, gifUrl } = row;
        exercises.push({ name, target, bodyPart, equipment, gifUrl });
      })
      .on('end', async () => {
        try {
          for (const exercise of exercises) {
            const addedID = await exerciseMethods.create(
              exercise.name,
              exercise.target,
              exercise.bodyPart,
              exercise.equipment,
              exercise.gifUrl
            );
            console.log(`Added ${exercise.name} with ID "${addedID}" successfully!`);
          }
          console.log('Done seeding exercises');
          resolve();
        } catch (error) {
          console.log(`Error adding exercises to database: ${error.message}`);
          reject(error);
        }
      });
  });
};


const workoutsData = [
  
  {
  "Workout Name": "Leg Workout",
  "Creator": "ADMIN",
  "Exercises": [
  {
  "Name": "barbell full squat",
  "Sets": "4",
  "Reps": "8",
  "Details": "Focus on keeping your back straight and your knees aligned with your toes."
  },
  {
  "Name": "barbell lunge",
  "Sets": "3",
  "Reps": "12",
  "Details": "Take long steps and ensure your front knee doesn't extend past your toes."
  },
  {
  "Name": "sled 45в° leg press",
  "Sets": "3",
  "Reps": "10",
  "Details": "Adjust the seat and foot position to target different areas of the legs."
  }
  ]
  },

  {
    "Workout Name": "Chest Workout",
    "Creator": "ADMIN",
    "Exercises": [
      {
        "Name": "barbell bench press",
        "Sets": "3",
        "Reps": "10",
        "Details": "Start with a warm-up set, then increase the weight gradually."
      },
      {
        "Name": "lever chest press",
        "Sets": "4",
        "Reps": "8",
        "Details": "Focus on maintaining proper form throughout the exercise."
      },
      {
        "Name": "cable cross-over revers fly",
        "Sets": "3",
        "Reps": "12",
        "Details": "Use controlled movements and squeeze the chest at the peak of each repetition."
      }
    ]
  },

  {
  "Workout Name": "Back Workout",
  "Creator": "ADMIN",
  "Exercises": [
  {
  "Name": "barbell deadlift",
  "ID": "6",
  "Sets": "4",
  "Reps": "8",
  "Details": "Maintain a straight back and engage your core throughout the movement."
  },
  {
  "Name": "pull up (neutral grip)",
  "ID": "7",
  "Sets": "3",
  "Reps": "10",
  "Details": "Use a grip that suits your comfort level and focus on pulling with your back muscles."
  },
  {
  "Name": "barbell bent over row",
  "ID": "8",
  "Sets": "3",
  "Reps": "12",
  "Details": "Keep your back straight and pull the weight towards your lower chest."
  }
  ]
  },

  {
  "Workout Name": "Shoulder Workout",
  "Creator": "ADMIN",
  "Exercises": [
  {
  "Name": "barbell rear delt row",
  "Sets": "4",
  "Reps": "8",
  "Details": "Start with a weight you can comfortably handle and gradually increase."
  },
  {
  "Name": "dumbbell full can lateral raise",
  "Sets": "3",
  "Reps": "12",
  "Details": "Keep your arms slightly bent and lift the weights to shoulder height."
  },
  {
  "Name": "barbell front raise",
  "Sets": "3",
  "Reps": "10",
  "Details": "Raise the dumbbells to shoulder height while keeping your arms straight."
  }
  ]
  }

];

/**
Here is exercises.js in the data layer to help you do the search: 
import { exercises } from '../config/mongoCollections.js';
import validator from 'validator';
import { ObjectId } from 'mongodb';

// {
//     "_id": ObjectId,
//     "name": String,
//     "target": String,
//     "bodyPart": String,
//     "equipment": String,
//     "gifUrl": String,
// }

const exerciseMethods = {
  async create(name, target, bodyPart, equipment, gifUrl) {
    if (validator.isEmpty(name)) {
        throw new Error('Invalid exercise name.');
    }
    if (validator.isEmpty(target)) {
        throw new Error('Invalid exercise target.');
    }
    if (validator.isEmpty(bodyPart)) {
        throw new Error('Invalid exercise body part.');
    }
    if (validator.isEmpty(equipment)) {
        throw new Error('Invalid exercise equipment.');
    }
    if (!validator.isURL(gifUrl)) {
        throw new Error('Invalid exercise gif URL.');
    }
    const newExercise = { name, target, bodyPart, equipment, gifUrl };
    const exercisesCollection = await exercises();
    const result = await exercisesCollection.insertOne(newExercise);
    if (result.insertedCount === 0) { throw new Error('Failed to add exercise'); }
      return result.insertedId;
  },
  async get(id) {
    if (!validator.isMongoId(id)) {
      throw new Error('Invalid exercise ID.');
    }
    const exercisesCollection = await exercises();
    const exercise = await exercisesCollection.findOne({ _id: new ObjectId(id) });
    if (!exercise) {
      throw new Error(`Exercise with ID ${id} not found.`);
    }
    return exercise;
  },
  async getByName(name) {
    if (!validator.isString(name)) {
      throw new Error('Invalid exercise name.');
    }
    const exercisesCollection = await exercises();
    const exercise = await exercisesCollection.findOne({ name });
    if (!exercise) {
      throw new Error(`Exercise with name ${name} not found.`);
    }
    return exercise;
  },
  async getByBodyPart(bodyPart) {
    if (!validator.isString(bodyPart)) {
      throw new Error('Invalid body part.');
    }
    const exercisesCollection = await exercises();
    const exerciseList = await exercisesCollection.find({ bodyPart }).toArray();
    return exerciseList;
  },
  async getByEquipment(equipment) {
    if (!validator.isString(equipment)) {
      throw new Error('Invalid equipment.');
    }
    const exercisesCollection = await exercises();
    const exerciseList = await exercisesCollection.find({ equipment }).toArray();
    return exerciseList;
  },
  async getByTarget(target) {
    if (!validator.isString(target)) {
      throw new Error('Invalid target.');
    }
    const exercisesCollection = await exercises();
    const exerciseList = await exercisesCollection.find({ target }).toArray();
    return exerciseList;
  },
  async getAll() {
    const exercisesCollection = await exercises();
    const exerciseList = await exercisesCollection.find().toArray();
    return exerciseList;
  },
  //retrieves a list of exercises that fit the provided arguments
  //arguments that are given a null or invalid value are ignored
  //calling this function with no arguments is equivalent to getAll()
  async filterBy(name, bodyPart, equipment, target){
    let searchObj = {};
    let parameterNames = ["name", "bodyPart", "equipment", "target"];
    let parameters = [name, bodyPart, equipment, target];
    for(let i = 0; i < parameters.length; i++){
      const current = parameters[i];
      //skip current parameter if parameter is empty or not a string
      if(validator.isEmpty(current) || !validator.isString(current)){
        continue;
      }
      //add to search object
      searchObj[parameterNames[i]] = current;
    }
    const exercisesCollection = await exercises();
    const excerciseList = await exercisesCollection.find(searchObj).toArray();
    return excerciseList;
  }
};

export default exerciseMethods;


*/

const seedWorkouts = async () => {
  try {
    for (const workoutData of workoutsData) {
      const exercises = [];
      for(const exerciseData of workoutData.Exercises) {
        const exercise = await exerciseMethods.getByName(exerciseData.Name.toLowerCase());
        if (!exercise) {
          throw new Error(`Exercise with name ${exerciseData.Name} not found.`);
        }
        exercises.push({
          exerciseId: exercise._id.toString(),
          sets: exerciseData.Sets,
          reps: exerciseData.Reps,
          additionalDetails: exerciseData.Details
        });
      }
      const workoutId = await workoutMethods.create(workoutData["Workout Name"], workoutData.Creator, exercises);
      console.log(`Added workout "${workoutData["Workout Name"]}" with ID "${workoutId}" successfully!`);
    }
    console.log('Done seeding workouts');
  } catch (error) {
    console.log(`Error adding workouts to database: ${error.message}`);
  }
};


const seedDatabase = async () => {
  const db = await dbConnection();

  try {
    await db.dropDatabase();
    console.log('Seeding database ...');

    console.log('Seeding database with exercises ...');
    await seedExercises();

    console.log('Seeding database with workouts ...');
    await seedWorkouts();

    console.log('Seeding database with users ...');
    const users = [];

    for (let i = 1; i <= 30; i++) {
      const user = {
        username: `student${i}`,
        password: `password${i}`,
        email: `student${i}@stevens.edu`,
      };
    
      users.push(user);
    }

    // Add users to the database
    for (const user of users) {
      const userId = await createUser(user.username, user.password, user.email);
      console.log(`Added user "${user.username}" with ID "${userId}" successfully!`);
    }

    console.log('Done seeding database');

  } catch (error) {
    console.log(`Error seeding database: ${error.message}`);
  } finally {
    await closeConnection();
  }
};

seedDatabase();
