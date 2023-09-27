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

<<<<<<< HEAD
// Generate a unique name using a UUID without hyphens
const generateUniqueName = () => uuid().replace(/-/g, '');

const generateUniqueEmail = () => {
  // Generate a unique email using a UUID without hyphens and without numbers
  const email = `${uuid().replace(/-/g, '')}@testing.com`;
  // Remove numbers from the email
  return email.replace(/\d/g, '');
};

// Generate a unique password using a UUID without hyphens
const generateUniquePassword = () => uuid().replace(/-/g, '');

const newDeveloperData = {
  name: generateUniqueName(),
  email: generateUniqueEmail(),
  password: generateUniquePassword(),
};

const developerOneData = {
  name: generateUniqueName(),
  email: generateUniqueEmail(),
  password: generateUniquePassword(),
};

const developerTwoData = {
  name: generateUniqueName(),
  email: generateUniqueEmail(),
  password: generateUniquePassword(),
};

const anotherDeveloperData = {
  name: generateUniqueName(),
  email: generateUniqueEmail(),
  password: generateUniquePassword(),
=======
const newDeveloperData = {
<<<<<<< HEAD
  name: 'New Developer',
  email: 'newdeveloper@example.com',
  password: 'password',
>>>>>>> 03f15e6 (Fix create login endpoint (#748))
=======
  name: `${uuid().replace(/-/g, '')}`,
  email: `${uuid().replace(/-/g, '')}@testing.com`,
  password: `${uuid()}`,
>>>>>>> 2b187a9 (Define the login business logic (#750))
};

const malformedDeveloperData = {
  email: 'developer@example.com',
  password: 'password',
};

<<<<<<< HEAD
export {
  wordId,
  exampleId,
  developerData,
  newDeveloperData,
  developerOneData,
  developerTwoData,
  anotherDeveloperData,
  malformedDeveloperData,
};
=======
export { wordId, exampleId, developerData, newDeveloperData, malformedDeveloperData };
>>>>>>> 03f15e6 (Fix create login endpoint (#748))
