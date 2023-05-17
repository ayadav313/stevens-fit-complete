import { workoutLogs } from '../config/mongoCollections.js';
import validator from 'validator';
import {ObjectId} from 'mongodb';


/*schema

{
    _id: ObjectId,
    userId: ObjectId, // User id who performed the workout
    workoutId: ObjectId, // Workout id from Workouts collection
    date: Date,
    exerciseLogs: [
        {
            exerciseId: ObjectId, // Exercise id from Exercises collection
            name: String, // name from Exercises collection
            sets: Number,
            reps: Number,
            notes: String
        }
    ]
}

*/

// TODO: create - initializes a workoutLog and adds it to the database

// TODO: getAll - gets all logs

// TODO: getById - gets a log by its ID

// TODO: getByUser - get all logs for a given userId

// TODO: getByWorkout - get all logs for a given workoutId

// TODO: getByDate - get all logs for a given date

// TODO: filterLogs - get all logs through one or many parameters (userId, workoutId, date)

// TODO: deleteLog - removes a log from the database

// TODO: updateLog - updates a log with new log information

// TODO: addExercise - adds an exerciseLog(exercise completed during workout) to the workoutLog

// TODO: removeExercise - removes exerciseLog from the workoutLog(used for testing purposes)


//creates a new work out log
const create = async(userId, workoutId, date, exerciseLogs) => {
  try{
    userId = isValidId(userId);
    workoutId = isValidId(workoutId);
    date = isValidDate(date);
    exerciseLogs = isValidExerciseLog(exerciseLogs);
  }
  catch(e){
      throw new Error('Error: workoutLogs: create: ' + e);
  }

  const workoutLog = {
        
    userId: userId, // User id who performed the workout
    workoutId: workoutId, // Workout id from Workouts collection
    date: date,
    exerciseLogs: exerciseLogs

  }

  const workoutLogCollection = await workoutLogs();
  const result = await workoutLogCollection.insertOne(workoutLog);

  if (result.insertedCount === 0) throw new Error('workoutLogs: create: Failed to add workoutLog');
  console.log("Data inserted successfully");
  return result;
}

//getAll - gets all logs
const getAll = async () => {

    const Logs_collection = await workoutLogs();

    const Logs_list = await Logs_collection.find().toArray();
    
    if(!Logs_list) throw new Error('Error: workoutLogs: getAll: could not get all workoutLogs');

    //TODO - maybe return all logs with string id instead of ObjectId id

    return Logs_list;
}

//getById - get a log by its ID
const getById = async (id) => {

    try {

        id = isValidId(id);

    }
    catch(e){
        throw new Error('Error: workoutLogs: getByUser: ' + e);
    }

    const Logs_collection = await workoutLogs();

    const objId = {_id: new ObjectId(id)};

    const log = await Logs_collection.findOne(objId);

    if (!log) throw new Error(`Error: workoutLogs: getById: no workoutLog with id ${id} found`);

    return log;
}

//getByUser - get all logs for a given userId
const getByUser = async (userId) => {

    try {

        userId = isValidId(userId);

    }
    catch(e){
        throw new Error('Error: workoutLogs: getByUser: ' + e);
    }

    const Logs_collection = await workoutLogs();

    const search_param = {userId: userId};

    const log = await Logs_collection.find(search_param).toArray();

    if (!log) throw new Error(`Error: workoutLogs: getByUser: no workoutLog with userId ${userId} found`);

    return log;
}

//getByWorkout - get all logs for a given workoutId
const getByWorkout = async (workoutId) => {

    try {

        workoutId = isValidId(workoutId);

    }
    catch(e){
        throw new Error('Error: workoutLogs: getByUser: ' + e);
    }

    const Logs_collection = await workoutLogs();

    const search_param = {workoutId: new ObjectId(workoutId)};

    const log = await Logs_collection.find(search_param).toArray();

    if (!log) throw new Error(`Error: workoutLogs: getByUser: no workoutLog with workoutId ${workoutId} found`);

    return log;
}

//getByDate - get all logs for a given date
const getByDate = async (date) => {

    try {

        date = isValidDate(date);

    }
    catch(e){
        throw new Error('Error: workoutLogs: getByDate: ' + e);
    }

    const Logs_collection = await workoutLogs();

    const search_param = {date: date};

    const log = await Logs_collection.find(search_param).toArray();

    if (!log) throw new Error(`Error: workoutLogs: getByUser: no workoutLog with date ${date} found`);

    return log;
}

//filterLogs - get all logs through one or many parameters (userId, workoutId, date). You can enter 0-3 parameters.
//0 parameters acts as getAll and each additional parameter will become a constraint
const filterLogs = async (userId, workoutId, date) => {
    let search_params = {};
    try{
        if(userId) {
            userId = isValidId(userId);
            search_params['userId'] = userId;
        }

        if(workoutId) {
            workoutId = isValidId(workoutId);
            search_params['workoutId'] = workoutId;
        }

        if(date) {
            date = isValidDate(date);
            search_params['date'] = date;
        }

        const Logs_collection = await workoutLogs();

        const logs = await Logs_collection.find(search_params).toArray();

        if(!logs) throw new Error('Error: workoutLogs: filterLogs: Could not find workoutLogs');

        return logs;

    }
    catch(e){
        throw new Error('Error: workoutLogs: filterLogs: ' + e);
    }
}

//deleteLog - removes a log from the database
const deleteLog = async (id) => {

    try {

        id = isValidId(id);

    }
    catch(e){
        throw new Error('Error: workoutLogs: deleteLog: ' + e);
    }

    const Logs_collection = await workoutLogs();

    const objId = {_id: new ObjectId(id)};

    const log = await Logs_collection.findOneAndDelete(objId);

    if (log.lastErrorObject.n === 0) throw new Error(`Error: workoutLogs: deleteLog: no workoutLog with id ${id} found or error deleting log`);

    return log.value._id.toString() + " deleted successfully";
}

//updateLog - updates a log with new log information
const updateLog = async (
                            id,
                            userId,
                            workoutId,
                            date,
                            exerciseLogs
                        ) => {

    try {

        id = isValidId(id);
        userId = isValidId(userId);
        workoutId = isValidId(workoutId);
        date = isValidDate(date);
        exerciseLogs = isValidExerciseLog(exerciseLogs);

    }
    catch(e){
        throw new Error('Error: workoutLogs: updateLog: ' + e);
    }


    const log = {
        
        userId: userId, // User id who performed the workout
        workoutId: workoutId, // Workout id from Workouts collection
        date: date,
        exerciseLogs: exerciseLogs

    }

    const objId = {_id: new ObjectId(id)};

    const Logs_collection = await workoutLogs();

    const result = await Logs_collection.findOneAndUpdate (
        objId,
        {$set: log},
        {returnDocument: 'after'}
    )

    if(result.lastErrorObject.n === 0) throw new Error(`Error: workoutLogs: updateLog: Update failed, could not find or update log with id: ${id}`);

    return result.value;
}

//addExercise - adds an exerciseLog(exercise completed during workout) to the workoutLog
const addExercise = async (id, exerciseLog) => {

    try {

        id = isValidId(id);
        if (Array.isArray(exerciseLog)) throw new Error('must provide exerciseLog, not Array');
        exerciseLog = isValidExerciseLog([exerciseLog])[0];

    }
    catch(e){
        throw new Error('Error: workoutLogs: addExercise: ' + e);
    }

    try{
        const log = await getById(id);

        log.exerciseLogs.push(exerciseLog);

        const result = await updateLog(id, log.userId, log.workoutId, log.date, log.exerciseLogs);

        return result;
    }
    catch(e) {
        throw new Error('Error: workoutLogs: addExercise: ' + e);
    }
}

//removeExercise - removes exerciseLog from the workoutLog(used for testing purposes)
const removeExercise = async (id, exerciseId) => {

    try {

        id = isValidId(id);
        exerciseId = isValidId(exerciseId);

    }
    catch(e){
        throw new Error('Error: workoutLogs: addExercise: ' + e);
    }

    try{
        const log = await getById(id);

        const exerciselogs = log.exerciseLogs.filter(x => x._id !== exerciseId);

        const result = await updateLog(id, log.userId, log.workoutId, log.date, exerciselogs);

        return result;
    }
    catch(e) {
        throw new Error('Error: workoutLogs: addExercise: ' + e);
    }
}

//checks to make sure that ObjectIds exist and follow mongoId conventions
const isValidId = (id) => { 

    if (!id) throw new Error('isValidId: must provide an id');

    if(typeof id !== 'string') throw new Error('isValidId: id must be of type string');

    if (id.trim().length === 0) throw new Error('isValidId: must not provide an empty id string');

    id = id.trim();

    if (!validator.isMongoId(id)) throw new Error('isValidId: must provide a valid id.');

    return id;
};

//checks to make sure that a date exists is valid
const isValidDate = (date) => {

    if (!date) throw new Error('isValidDate: must provide a date');

    const _d = new Date(Date.parse(date));

    if(!validator.isDate(_d)) throw new Error('isValidDate: must provide a valid date');

    return date;
}

//check exerciseLog array for type and element validity
const isValidExerciseLog = (log) => {
  return log;
    if (log.length !== 0){
        for (var i of log){

            //check exerciseLog id
            i.exerciseId = isValidId(i.exerciseId);

            //check exerciseLog name
            if(!i.name) throw new Error('isValidExerciseLog: exerciseLog must have valid name and be of type string');
            if(typeof i.name !== 'string') throw new Error('isValidExerciseLog: exerciseLog must be of type string');
            if(i.name.trim().length === 0) throw new Error('isValidExerciseLog: exerciseLog must not be empty');
            i.name = i.name.trim();
            
            //check exerciseLog sets and reps as non-zero numbers
            if(!sets || !reps) throw new Error('isValidExerciseLog: sets and reps must be valid numbers');
            if(typeof i.sets !== 'number' || typeof i.reps !== 'number') throw new Error('isValidExerciseLog: sets and reps must be valid numbers');
            if(i.sets < 0 || i.reps < 0) throw new Error('isValidExerciseLog: sets and reps must be non-zero numbers');
            
            //check that notes are of type string. They can be empty notes.
            if(typeof notes !== 'string') throw new Error('isValidExerciseLog: notes must be of type string');
        }
    }
    return log;
}



export {
    create,         //create - initializes a workoutLog and adds it to the database

    getAll,         //getAll - gets all logs

    getById,        //getById - get a log with a given id

    getByUser,      //getByUser - get all logs for a given userId

    getByWorkout,   //getByWorkout - get all logs for a given workoutId

    getByDate,      //getByDate - get all logs for a given date

    filterLogs,     //filterLogs - get all logs through one or many parameters (userId, workoutId, date)

    deleteLog,      //deleteLog - removes a log from the database

    updateLog,      //updateLog - updates a log with new log information

    addExercise,    //addExercise - adds an exerciseLog(exercise completed during workout) to the workoutLog

    removeExercise  //removeExercise - removes exerciseLog from the workoutLog(used for testing purposes)
};