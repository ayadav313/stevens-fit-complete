/**
 * @swagger
 * tags:
 *   - name: Workouts
 *     description: API for managing workouts
 */

import express from 'express';
import workoutMethods from '../data/workouts.js';
import validator from 'validator';

const workoutsRouter = express.Router();

/**
 * @swagger
 * /workouts:
 *   post:
 *     summary: Creates a new workout
 *     tags:
 *       - Workouts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               creator:
 *                 type: string
 *               exerciseLogs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exerciseId: 
 *                       type: string
 *                       example: 612db8f48a7c18bf22004b0a
 *                     sets:
 *                       type: number
 *                       example: 3
 *                     reps:
 *                       type: number
 *                       example: 8
 *                     additionalDetails:
 *                       type: string
 *                       example: "Rest two minutes between sets"
 *                      
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
workoutsRouter.post('/', async(req, res) => {
  try{
    const {name, creator, exercises} = req.body.workoutObj;
    const workout = await workoutMethods.create(name, creator, exercises);
    res.status(201).json(workout);
  }
  catch(e){
    res.status(400).json({message: e.message})
  }
});


/**
 * @swagger
 * /workouts/{id}:
 *   get:
 *     summary: Get an workout by ID
 *     tags:
 *       - Workouts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workout
 *     responses:
 *       200:
 *         description: A workout object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 612db8f48a7c18bf22004b0a
 *                 name:
 *                   type: string
 *                   example: Full Body Strength Training
 *                 creator:
 *                   type: string
 *                   example: 612db8f48a7c18bf22004b0a
 *                 exerciseLogs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       exerciseId: 
 *                         type: string
 *                         example: 612db8f48a7c18bf22004b0a
 *                       sets:
 *                         type: number
 *                         example: 3
 *                       reps:
 *                         type: number
 *                         example: 8
 *                       additionalDetails:
 *                         type: string
 *                         example: "Rest two minutes between sets"
 *       404:
 *         description: Workout not found
 */
workoutsRouter.get('/:id', async (req, res) => {
  try{
    const workout = await workoutMethods.get(req.params.id);
    res.json(workout);
  }
  catch(e){
    console.log(e.message);
    res.status(404).json({message: e.message});
  }

})

/**
 * @swagger
 * /workouts/creator/{creatorID}:
 *   get:
 *     summary: Get a list of exercises by creator
 *     tags:
 *       - Workouts
 *     parameters:
 *       - in: path
 *         name: creator
 *         required: true
 *         schema:
 *           type: string
 *           example: 612db8f48a7c18bf22004b0a
 *         description: The ID of the creator for which to get exercises
 *     responses:
 *       200:
 *         description: An array of workout objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 612db8f48a7c18bf22004b0a
 *                   name:
 *                     type: string
 *                     example: Full Body Strength Training
 *                   creator:
 *                     type: string
 *                     example: 612db8f48a7c18bf22004b0a
 *                   exerciseLogs:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         exerciseId: 
 *                           type: string
 *                           example: 612db8f48a7c18bf22004b0a
 *                         sets:
 *                           type: number
 *                           example: 3
 *                         reps:
 *                           type: number
 *                           example: 8
 *                         additionalDetails:
 *                           type: string
 *                           example: "Rest two minutes between sets"
 *       404:
 *         description: No workouts found
 */
workoutsRouter.get('/creator/:creatorID', async (req, res) => {
  try {
    const workoutsList = await workoutMethods.getByCreator(req.params.creatorID);
    res.json(workoutsList);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
  }
});

/**
 * @swagger
 * /workouts:
 *   get:
 *     summary: Returns a list of all existing workouts
 *     tags:
 *       - Workouts 
 *     responses:
 *       200:
 *         description: An array of workout objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 612db8f48a7c18bf22004b0a
 *                   name:
 *                     type: string
 *                     example: Full Body Strength Training
 *                   creator:
 *                     type: string
 *                     example: 612db8f48a7c18bf22004b0a
 *                   exerciseLogs:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         exerciseId: 
 *                           type: string
 *                           example: 612db8f48a7c18bf22004b0a
 *                         sets:
 *                           type: number
 *                           example: 3
 *                         reps:
 *                           type: number
 *                           example: 8
 *                         additionalDetails:
 *                           type: string
 *                           example: "Rest two minutes between sets"
 *       404:
 *         description: No workouts found
 */
workoutsRouter.get('/all', async (req, res) => {
  try{
    const workoutsList = await workoutMethods.getAll();
    res.json(workoutsList);
  }
  catch(error){
    console.log(error.message);
    res.status(404).json({messaeg: error.message});
  }
})

workoutsRouter.get('/', async (req, res) => {
  try{
    const workoutsList = await workoutMethods.getAll();
    res.json(workoutsList);
  }
  catch(error){
    console.log(error.message);
    res.status(404).json({messaeg: error.message});
  }
})

/**
 * @swagger
 * /workouts/name/{name}:
 *   get:
 *     summary: Get a list of exercises by name
 *     tags:
 *       - Workouts
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           example: 612db8f48a7c18bf22004b0a
 *         description: The name for which to get exercises
 *     responses:
 *       200:
 *         description: An array of workout objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 612db8f48a7c18bf22004b0a
 *                   name:
 *                     type: string
 *                     example: Full Body Strength Training
 *                   creator:
 *                     type: string
 *                     example: 612db8f48a7c18bf22004b0a
 *                   exerciseLogs:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         exerciseId: 
 *                           type: string
 *                           example: 612db8f48a7c18bf22004b0a
 *                         sets:
 *                           type: number
 *                           example: 3
 *                         reps:
 *                           type: number
 *                           example: 8
 *                         additionalDetails:
 *                           type: string
 *                           example: "Rest two minutes between sets"
 *       404:
 *         description: No workouts found
 */
workoutsRouter.get('/name/:name', async (req, res) => {
  try {
    const workoutsList = await workoutMethods.getByName(req.params.name);
    res.json(workoutsList);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
  }
});

/**
 * @swagger
 * /workouts/filter:
 *   get:
 *     summary: Get a list of workouts that contain all the specified workouts
 *     tags:
 *       - Workouts
 *     parameters:
 *       - in: path
 *         name: exerciseIDs
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: A string representation of the list of IDs to filter workouts with
 *     responses:
 *       200:
 *         description: An array of workout objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 612db8f48a7c18bf22004b0a
 *                   name:
 *                     type: string
 *                     example: Full Body Strength Training
 *                   creator:
 *                     type: string
 *                     example: 612db8f48a7c18bf22004b0a
 *                   exerciseLogs:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         exerciseId: 
 *                           type: string
 *                           example: 612db8f48a7c18bf22004b0a
 *                         sets:
 *                           type: number
 *                           example: 3
 *                         reps:
 *                           type: number
 *                           example: 8
 *                         additionalDetails:
 *                           type: string
 *                           example: "Rest two minutes between sets"
 *       404:
 *         description: No workouts found
 */
workoutsRouter.get('/filter/:exerciseIDs', async (req, res) => {
  try {
    const exerciseIDs = JSON.parse(req.params.exerciseIDs);
    const workoutsList = await workoutMethods.filterByContainedExercises(exerciseIDs);
    res.status(201).json(workoutsList);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
  }
});

export default workoutsRouter;