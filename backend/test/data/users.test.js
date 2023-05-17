// test/users.test.js

import { expect } from 'chai';
import { dbConnection, closeConnection } from '../../config/mongoConnection.js';
import { createUser, deleteUser, getAllUsers } from '../../data/users.js';



describe('createUser(), getAllUsers(), and deleteUser()', () => {
    let userId;

    it('should create a new user', async () => {
        const username = 'mytestuser';
        const password = 'testpassword';
        const email = 'testuser@example.com';

        const result = await createUser(username, password, email);
        expect(result).to.be.true;

        // Get the created user from the database
        const db = await dbConnection();
        const usersCollection = await db.collection('users');
        const newUser = await usersCollection.findOne({ username: username });

        expect(newUser).to.not.be.null;
        expect(newUser.username).to.equal(username);
        expect(newUser.email).to.equal(email);

        // Store the user ID for the next test
        userId = newUser._id;
    });

    it('should throw an error for an invalid username', async () => {
        const invalidUsername = 'test user';
        const password = 'testpassword';
        const email = 'testuser@example.com';

        try {
          await createUser(invalidUsername, password, email);
        } catch (error) {
          expect(error.message).to.equal('Invalid username');
        }
    });

    it('should throw an error for an invalid password', async () => {
        const username = 'testuser2';
        const invalidPassword = '';
        const email = 'testuser2@example.com';

        try {
        await createUser(username, invalidPassword, email);
        } catch (error) {
        expect(error.message).to.equal('Invalid password');
        }
    });

    it('should throw an error for an invalid email', async () => {
        const username = 'testuser3';
        const password = 'testpassword';
        const invalidEmail = 'testuser3example.com';

        try {
        await createUser(username, password, invalidEmail);
        } catch (error) {
        expect(error.message).to.equal('Invalid email');
        }
    });

    it('should throw an error for an existing username', async () => {
        const existingUsername = 'testuser';
        const password = 'testpassword';
        const email = 'testuser4@example.com';

        try {
        await createUser(existingUsername, password, email);
        } catch (error) {
        expect(error.message).to.equal('Username already exists');
        }
    });

    it('should get all users', async () => {

    })
    
    it('should delete the user', async () => {
      const result = await deleteUser(userId.toHexString());
      expect(result).to.be.true;

      // Check if the user is removed from the database
      const db = await dbConnection();
      const usersCollection = await db.collection('users');
      const deletedUser = await usersCollection.findOne({ _id: userId });

      expect(deletedUser).to.be.null;
    });
    
    it('should throw an error for an invalid user ID', async () => {
      const invalidUserId = 'invalidUserId';
      try {
      await deleteUser(invalidUserId);
      } catch (error) {
      expect(error.message).to.equal('Invalid user ID');
      }
    });
})

describe('getAllUsers()', () => {

    // Insert test data into the database
  before(async () => {
    const db = await dbConnection();
    const usersCollection = await db.collection('users');
    const testUsers = [
      { username: 'testuser1', password: 'testpass1', email: 'testuser1@example.com' },
      { username: 'testuser2', password: 'testpass2', email: 'testuser2@example.com' },
      { username: 'testuser3', password: 'testpass3', email: 'testuser3@example.com' }
    ];
    await usersCollection.insertMany(testUsers);
  });
  
  it('should get all users', async () => {
    // Get all the users from the database
    const allUsers = await getAllUsers();

    // Check if all the test users are included in the result
    expect(allUsers.length).to.equal(testUsers.length);
    for (let i = 0; i < testUsers.length; i++) {
      const testUser = testUsers[i];
      const foundUser = allUsers.find(user => user.username === testUser.username);
      expect(foundUser).to.not.be.undefined;
      expect(foundUser.email).to.equal(testUser.email);
    }

    // Remove the test data from the database
    await usersCollection.deleteMany({});
  });

  // Remove the test data from the database
  after(async () => {
    const db = await dbConnection();
    const testCollection = await db.collection('users');
    await testCollection.deleteMany({});
    await closeConnection();
  });
  
})