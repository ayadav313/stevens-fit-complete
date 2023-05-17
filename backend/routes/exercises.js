/**
 * @swagger
 * tags:
 *   - name: Exercises
 *     description: API for managing exercises
 */

import express from 'express';
import exerciseMethods from '../data/exercises.js';

const router = express.Router();

/**
 * @swagger
 * /exercises:
 *   post:
 *     summary: Creates a new exercise
 *     tags:
 *       - Exercises
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               target:
 *                 type: string
 *               bodyPart:
 *                 type: string
 *               equipment:
 *                 type: string
 *               gifUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
  try {
    const { name, target, bodyPart, equipment, gifUrl } = req.body;
    const exercise = await exerciseMethods.create(name, target, bodyPart, equipment, gifUrl);
    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /exercises:
 *   get:
 *     summary: Returns a list of exercises
 *     tags:
 *       - Exercises 
 *     responses:
 *       200:
 *         description: A list of exercises
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
 *                     example: Squat
 *                   target:
 *                     type: string
 *                     example: Legs
 *                   bodyPart:
 *                     type: string
 *                     example: Quads
 *                   equipment:
 *                     type: string
 *                     example: Barbell
 *                   gifUrl:
 *                     type: string
 *                     example: https://example.com/squat.gif
 */
router.get('/', async (req, res) => {
    try {
      const exerciseList = await exerciseMethods.getAll();
      res.json(exerciseList);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

/**
 * @swagger
 * /exercises/{id}:
 *   get:
 *     summary: Get an exercise by ID
 *     tags:
 *       - Exercises
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the exercise
 *     responses:
 *       200:
 *         description: An exercise object
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
 *                   example: Squat
 *                 target:
 *                   type: string
 *                   example: Legs
 *                 bodyPart:
 *                   type: string
 *                   example: Quads
 *                 equipment:
 *                   type: string
 *                   example: Barbell
 *                 gifUrl:
 *                   type: string
 *                   example: https://example.com/squat.gif
 *       404:
 *         description: Exercise not found
 */
router.get('/:id', async (req, res) => {
  try {
    const exercise = await exerciseMethods.get(req.params.id);
    res.json(exercise);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * @swagger
 * /exercises/body-part/{bodyPart}:
 *   get:
 *     summary: Get a list of exercises by body part
 *     tags:
 *       - Exercises
 *     parameters:
 *       - in: path
 *         name: bodyPart
 *         required: true
 *         schema:
 *           type: string
 *         description: The body part for which to get exercises
 *     responses:
 *       200:
 *         description: A list of exercises
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
 *                     example: Squat
 *                   target:
 *                     type: string
 *                     example: Legs
 *                   bodyPart:
 *                     type: string
 *                     example: Quads
 *                   equipment:
 *                     type: string
 *                     example: Barbell
 *                   gifUrl:
 *                     type: string
 *                     example: https://example.com/squat.gif
 *       404:
 *         description: No exercises found
 */
router.get('/body-part/:bodyPart', async (req, res) => {
  try {
    const exerciseList = await exerciseMethods.getByBodyPart(req.params.bodyPart);
    res.json(exerciseList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * @swagger
 * /exercises/equipment/{equipment}:
 *   get:
 *     summary: Get a list of exercises by equipment
 *     tags:
 *       - Exercises
 *     parameters:
 *       - in: path
 *         name: equipment
 *         required: true
 *         schema:
 *           type: string
 *         description: The equipment for which to get exercises
 *     responses:
 *       200:
 *         description: A list of exercises
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
 *                     example: Squat
 *                   target:
 *                     type: string
 *                     example: Legs
 *                   bodyPart:
 *                     type: string
 *                     example: Quads
 *                   equipment:
 *                     type: string
 *                     example: Barbell
 *                   gifUrl:
 *                     type: string
 *                     example: https://example.com/squat.gif
 *       404:
 *         description: No exercises found
 */
router.get('/equipment/:equipment', async (req, res) => {
  try {
    const exerciseList = await exerciseMethods.getByEquipment(req.params.equipment);
    res.json(exerciseList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * @swagger
 * /exercises/target/{target}:
 *   get:
 *     summary: Get a list of exercises by target area
 *     tags:
 *       - Exercises
 *     parameters:
 *       - in: path
 *         name: target
 *         required: true
 *         schema:
 *           type: string
 *         description: The target area for which to get exercises
 *     responses:
 *       200:
 *         description: A list of exercises
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
 *                     example: Squat
 *                   target:
 *                     type: string
 *                     example: Legs
 *                   bodyPart:
 *                     type: string
 *                     example: Quads
 *                   equipment:
 *                     type: string
 *                     example: Barbell
 *                   gifUrl:
 *                     type: string
 *                     example: https://example.com/squat.gif
 *       404:
 *         description: No exercises found
 */
router.get('/target/:target', async (req, res) => {
  try {
    const exerciseList = await exerciseMethods.getByTarget(req.params.target);
    res.json(exerciseList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
