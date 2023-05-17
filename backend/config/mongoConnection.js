/**
  MongoDB Connection Management
  This module exports functions for establishing and closing a connection to a MongoDB instance.
  It leverages the MongoClient from the 'mongodb' package and the configuration from the 'settings.js' module.
  The functions maintain a single connection instance and ensure the same connection is reused for multiple requests.
  @module mongoConnection
  @version 1.0.0
  @since 2023-04-01
*/

import { MongoClient } from 'mongodb';
import { mongoConfig } from './settings.js';

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
  }
  return _db;
};

const closeConnection = async () => {
  await _connection.close();
};

export { dbConnection, closeConnection };