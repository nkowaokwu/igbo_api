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
};

const malformedDeveloperData = {
  email: 'developer@example.com',
  password: 'password',
};

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
