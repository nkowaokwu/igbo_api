import map from 'lodash/map';
import flatten from 'lodash/flatten';
import keys from 'lodash/keys';
import omit from 'lodash/omit';
import { createWord } from '../controllers/words';
import dictionary from './ig-en/ig-en.json';
import Dialects from '../shared/constants/Dialect';
import WordClass from '../shared/constants/WordClass';
import { createDbConnection, handleCloseConnection } from '../services/database';

const WRITE_DB_DELAY = 15000;

const populate = async (connection) => {
  /* This route will populate a local MongoDB database */
  if (process.env.NODE_ENV !== 'production') {
    console.blue('🌱 Seeding database...');
    connection.dropDatabase();
    const wordPromises = flatten(
      map(keys(dictionary), (key) => {
        const value = dictionary[key];
        return map(value, (term) => {
          const word = omit({ ...term }, ['stems']);
          const cleanedKey = key.replace(/\./g, '');
          word.word = key;
          word.definitions = [
            {
              wordClass: word.wordClass || WordClass.NNC.value,
              definitions: word.definitions,
            },
          ];
          word.dialects = [{
            dialects: [Dialects.NSA.value],
            variations: [],
            pronunciation: '',
            word: `${cleanedKey}-dialect`,
          }];
          return createWord(word, connection);
        });
      }),
    );
    /* Waits for all the MongoDB document save promises to resolve */
    const savedWords = await Promise.all(wordPromises)
      .then(async () => {
        /* Wait 15 seconds to allow the data to be written to database */
        await new Promise((resolve) => setTimeout(() => {
          console.green('✅ Seeding successful');
          if (process.env.NODE_ENV === 'production') {
            resolve();
            process.exit(0);
          } else {
            resolve();
          }
        }, WRITE_DB_DELAY));
      })
      .catch((err) => {
        console.red('🔴 Seeding failed', err);
      });
    return savedWords;
  }
  return Promise.resolve();
};

const seed = () => {
  const connection = createDbConnection();
  connection.on('error', console.error.bind(console, 'connection error:'));
  return new Promise((resolve) => connection.once('connected', async () => {
    console.green('🗄 Database is connected');
    await populate(connection);
    await handleCloseConnection(connection);
    return resolve();
  }));
};

const sendResponseAndEndServer = (res) => {
  res.redirect('/');
  return setTimeout(() => {
    console.log('💡 Restarting the server');
    return process.exit(0);
  }, 2000);
};

export const seedDatabase = async (_, res, next) => {
  try {
    await seed();
    /* Ends the docker container to restart. Necessary for
     * Text Indexes to be created for testing purposes */
    if (process.env.CONTAINER_HOST === 'mongodb') {
      return sendResponseAndEndServer(res);
    }
    return res.redirect('/');
  } catch (err) {
    return next(new Error('An error occurred during seeding'));
  }
};
