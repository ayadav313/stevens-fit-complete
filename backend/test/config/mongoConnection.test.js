import { expect } from 'chai';
import { dbConnection, closeConnection } from '../../config/mongoConnection.js';
import { mongoConfig } from '../../config/settings.js';

describe('Mongo Connection', () => {

    it('should establish a connection', async () => {
        const db = await dbConnection();
        expect(db).to.not.be.null;
        expect(db.databaseName).to.equal(mongoConfig.database);
    });


    it('should close the connection', async () => {
        //TODO
    });
});
