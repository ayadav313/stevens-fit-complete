import { expect } from 'chai';
import { users } from '../../config/mongoCollections.js';

describe('Mongo Collections', () => {
  it('should retrieve the users collection', async () => {
    const bandsCollection = await users();
    const collectionName = bandsCollection.collectionName;
    expect(collectionName).to.exist;
    expect(collectionName).to.equal('users');
  });
});