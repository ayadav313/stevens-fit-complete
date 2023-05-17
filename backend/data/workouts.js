import { workouts } from "../config/mongoCollections.js";
import validator from "validator";
import {ObjectId} from 'mongodb';

// Scheme for workouts
// {
//     "_id": ObjectId, Id of workout
//     "name": String,
//     "creator": ObjectId, Id of user who created workout
//     "exercises": List of exercise objects[
//     {
//          "exerciseId": ObjectId Id of workout, from exercises collection
//          "sets": Number,
//          "reps": Number,
//          "additionalDetails": String,
//      }]
// }


const workoutMethods = {
//creates and adds exercise object
//additional properties in exercise objects are ignored
async create(name, creator, exercises){
    if(validator.isEmpty(name)){
        throw new Error("Invalid workout name.");
    }
    if(validator.isEmpty(creator)){
        throw new Error("Invalid creator id.");
    }
    if(!Array.isArray(exercises) || exercises.length < 1){
        throw new Error("Invalid excerise list.");
    }
    
    let filteredList = [];
    for(let i = 0; i < exercises.length; i++){
        const currentExercise = exercises[i];
        this.validateExercise(currentExercise);
        
        let filteredExercise = {};
        filteredExercise.exerciseId = currentExercise.exerciseId;
        filteredExercise.sets = currentExercise.sets;
        filteredExercise.reps = currentExercise.reps;
        if(currentExercise.additionalDetails != null && !validator.isEmpty(currentExercise.additionalDetails)){
            filteredExercise.additionalDetails = currentExercise.additionalDetails;
        }
        filteredList.push(filteredExercise);
    }
    const workout = {
        name: name,
        creator: creator,
        exerciseLogs: filteredList
    };
    const workoutsCollection = await workouts();
    const result = await workoutsCollection.insertOne(workout);
    if(result.insertedCount === 0){
        throw new Error("Failed to add workout");
    }
    return result.insertedId;
},
//validates an exercise object
//exercise object must contain the following properties:
//exerciseId: that is a valid ID from the exercises collection
//sets: number that is a positive integer
//reps: number that is a positive integer
validateExercise(exercise){

    const keys = Object.keys(exercise);
    if(!keys.includes("exerciseId")){
        throw new Error("Invalid Exercise Object: does not contain field 'exerciseId'");
    }
    if(!keys.includes("sets")){
        throw new Error("Invalid Exercise Object: does not contain field 'sets'");
    }
    if(!keys.includes("reps")){
        throw new Error("Invalid Exercise Object: does not contain field 'reps'");
    }
    if(!validator.isMongoId(exercise.exerciseId)){
        throw new Error("Invalid Exercise Object: Invalid exercise ID.");
    }
    if(!validator.isInt(exercise.sets) || exercise.sets < 1){
        throw new Error("Invalid Exercise Object: Invalid set number.");
    }
    if(!validator.isInt(exercise.reps) || exercise.reps < 1){
        throw new Error("Invalid Exercise Object: Invalid rep number.");
    }
},
//returns a workout by id
async get(id){
    if(!validator.isMongoId(id)){
        throw new Error("Invalid workout ID.");
    }
    const workoutsCollection = await workouts();
    const output = await workoutsCollection.findOne({_id: new ObjectId(id)});
    if(!output){
        throw new Error(`Workout with ID ${id} not found.`);
    }
    return output;
},
//returns a list of workouts created by the user with the provided userId
async getByCreator(userId){
    if(!validator.isMongoId(userId)){
        throw new Error("Invalid user ID.");
    }
    const workoutsCollection = await workouts();
    const output = await workoutsCollection.find({creator: userId}).toArray();
    return output;
},
async getAll() {
    const workoutsCollection = await workouts();
    const output = await workoutsCollection.find().toArray();
    return output;
},
//gets a list of workouts that match the provided name
//empty string is a valid search term that just returns all existing workouts
async getByName(name){
    const workoutsCollection = await workouts();
    const output = await workoutsCollection.find({name: name}).toArray();
    return output;
},
//gets a list of workouts that contain all workouts specified in list
//exercises is a list of Ids
async filterByContainedExercises(exercises){
    const workoutList = await this.getAll();
    for(let i = 0; i < exercises.length; i++){
        if(!validator.isMongoId(exercises[i])){
            throw new Error("Invalid exercise ID.");
        }
    }
    
    const matchingWorkouts = [];
    for(let i = 0; i < workoutList.length; i++){
        const currentWorkout = workoutList[i];
        const currentWorkoutList = [];

        //getting the list of workout IDs
        for(let x = 0; x < currentWorkout.exercises.length; x++){
            currentWorkoutList.push(currentWorkout.exercises.exerciseId);
        }
        
        let containsAll = true;
        //checking to see if each exercise is in the workout
        for(let x = 0; x < exercises.length; x++){
            if(!currentWorkoutList.includes(exercises[i])){
                containsAll = false;
                break;
            }
        }
        if(containsAll){
            matchingWorkouts.push(currentWorkout);
        }
    }
    return matchingWorkouts;
}


}

export default workoutMethods;
