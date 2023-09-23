import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

const { ObjectId } = mongoose.Types;

const wordId = new ObjectId('5f864d7401203866b6546dd3');
const exampleId = new ObjectId('5f864d7401203866b6546dd3');
const developerData = {
  name: 'Developer',
  email: 'developer@example.com',
  password: 'password',
};

const newDeveloperData = {
  name: `${uuid().replace(/-/g, '')}`,
  email: `${uuid().replace(/-/g, '')}@testing.com`,
  password: `${uuid()}`,
};

const malformedDeveloperData = {
  email: 'developer@example.com',
  password: 'password',
};

export { wordId, exampleId, developerData, newDeveloperData, malformedDeveloperData };
