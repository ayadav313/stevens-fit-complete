/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API for managing users
 */

import express from 'express';
import validator from 'validator';


import {
  createUser,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  getAllUsers,
  checkUserByEmail,
  addFriend,
  removeFriend,
  getFriends
} from '../data/users.js';

const router = express.Router();

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Creates a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) { return res.status(400).json({ message: 'All fields are required' }); }

        // Validate input
        if (!validator.isAlphanumeric(username) || validator.isEmpty(username)) { return res.status(400).json({ message: 'Invalid username' }); }

        if (validator.isEmpty(password)) { return res.status(400).json({ message: 'Invalid password' }); }

        if (!validator.isEmail(email)) { return res.status(400).json({ message: 'Invalid email' });}

        await createUser(username, password, email);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /user/{id}: 
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!validator.isMongoId(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      await deleteUser(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users
 */

router.get('/', async (req, res) => {
  // Implement the route to get all users
  try{
    const users = await getAllUsers();
    res.status(200).json(users);
  }
  catch(e){
    res.status(500).json({message: e.message})
  }
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A user object
 */
router.get('/:id', async (req, res) => {
  try{
    const id = req.params.id;
    if(!validator.isMongoId(id)){
      return res.status(400).json({message: "Invalid user ID"});
    }
    const user = await getUserById(id);
    res.status(200).json(user);
  }
  catch(e){
    res.status(500).json({message: e.message})
  }
});

/**
 * @swagger
 * /user/username/{username}:
 *   get:
 *     summary: Get a user by username
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's username
 *     responses:
 *       200:
 *         description: A user object
 */
router.get('/username/:username', async (req, res) => {
  try{
    const username = req.params.username;
    if(!validator.isAlphanumeric(username) || validator.isEmpty(username)){
      return res.status(400).json({message: "Invalid username"});
    }
    const user = await getUserByUsername(username);
    res.status(200).json(user);
  }
  catch(e){
    res.status(500).json({message: e.message})
  }
});

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user object
 */
router.put('/:id', async (req, res) => {
  try{
    const id = req.params.id;
    const user = req.body.user;
    if(!validator.isMongoId(id)){
      return res.status(400).json({message: "Invalid user ID"});
    }
    await updateUser(id, user);
    res.status(200).json({message: "User updated successfully"});
  }
  catch(e){
    res.status(500).json({message: e.message});
  }

});

/**
 * @swagger
 * /user/check/username:
 *   post:
 *     summary: Checks if username-password pair is valid (password should be sent already hashed)
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: username-password pair is valid
 *       400:
 *         description: Bad request/invalid
 */
router.post('/check/username', async(req, res) => {
  const body = req.body;

  try{
    await users.checkUserByUsername(body.username, body.password);
    res.status(201).json({message: "Username Password pair is valid"});
  }
  catch(e){
    res.status(400).json({message: e.message});
  }
});

/**
 * @swagger
 * /user/check/email:
 *   post:
 *     summary: Checks if email-password pair is valid (password should be sent already hashed)
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: username-password pair is valid
 *       400:
 *         description: Bad request/invalid
 */
router.post('/check/email', async(req, res) => {
  const body = req.body;
  try{
    const user = await checkUserByEmail(body.email, body.password);
    user.password = "";
    req.session.user = user;
    res.status(201).json(user);
  }
  catch(e){
    res.status(400).json({message: e.message});
  }
});



//addFriend - adds a friend userId to the friends array
router.put('/addFriend/:id', async (req, res) => {
  let id = req.params.id;
  let { friendId } = req.body;

  try{

      id = isValidId(id);
      friendId = isValidId(friendId);

  }
  catch(e){

      return res.status(400).json({error: 'Error: users route: PUT /addFriend/{id} : ' + e});

  }

  try{

      const user = await addFriend(id, friendId);
      res.status(200).json(user);

  }
  catch(e){
      return res.status(500).json({error: 'Error: users route: PUT /addFriend/{id} : ' + e});
  }

});


//removeFriend - remove a friend userId from the friends array
router.put('/removeExercise/:id', async (req, res) => {
  let id = req.params.id;
  let { friendId } = req.body;

  try{

      id = isValidId(id);
      friendId = isValidId(friendId);

  }
  catch(e){

      return res.status(400).json({error: 'Error: users route: PUT /removeFriend/{id} : ' + e});

  }

  try{

      const user = await removeFriend(id, friendId);
      res.status(200).json(user);

  }
  catch(e){
      return res.status(500).json({error: 'Error: users route: PUT /removeFriend/{id} : ' + e});
  }

});


/* /user/friends/{id}:
*   get:
*     summary: Get a user's friend list by id
*     tags:
*       - Users
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: The user's id
*     responses:
*       200:
*         description: A userId Array
*       400:
          description: request error
        500:
          server error
**/
router.get('/friends/:id', async (req, res) => {

  let id = req.params.id;

  try{

    id = isValidId(id);

  }
  catch(e) {
    return res.status(400).json({error: 'Error: users route: GET /friends/{id} : ' + e});
  }

  try{

    const list = await getFriends(id);

    res.status(200).json(list);

  }
  catch(e){
    res.status(500).json({error: 'Error: users route: GET /friends/{id} : ' + e});
  }

});

//checks to make sure that ObjectIds exist and follow mongoId conventions
const isValidId = (id) => { 

    if (!id) throw new Error('isValidId: must provide an id');

    if(typeof id !== 'string') throw new Error('isValidId: id must be of type string');

    if (id.trim().length === 0) throw new Error('isValidId: must not provide an empty id string');

    id = id.trim();

    if (!validator.isMongoId(id)) throw new Error('isValidId: must provide a valid id.');

    return id;
};

export default router;