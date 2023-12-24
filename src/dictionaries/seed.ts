import { Response } from 'express';
import { Connection } from 'mongoose';
import { map, flatten, keys, omit } from 'lodash';
import { createWord } from '../controllers/words';
import { createNsibidiCharacter } from '../controllers/nsibidi';
import { createExample } from '../controllers/examples';
import dictionary from './ig-en/ig-en.json';
import nsibidiDictionary from './nsibidi/nsibidi_dictionary';
import Dialects from '../shared/constants/Dialect';
import WordClass from '../shared/constants/WordClass';
import { createDbConnection, handleCloseConnection } from '../services/database';
import { MiddleWare } from '../types/express';
import ExampleStyleEnum from '../shared/constants/ExampleStyleEnum';

const WRITE_DB_DELAY = 15000;

const populate = async (connection: Connection) => {
  /* This route will populate a local MongoDB database */
  if (process.env.NODE_ENV !== 'production') {
    console.blue('🌱 Seeding database...');
    connection.dropDatabase();
    const words = flatten(
      await Promise.all(
        map(keys(dictionary), async (key) => {
          // @ts-expect-error LegacyWord
          const value = dictionary[key];
          return Promise.all(
            map(value, (term) => {
              const word = omit({ ...term }, ['stems']);
              const cleanedKey = key.replace(/\./g, '');
              word.word = key;
              word.definitions = [
                {
                  wordClass: word.wordClass || WordClass.NNC.value,
                  definitions: word.definitions,
                },
              ];
              word.dialects = [
                {
                  dialects: [Dialects.NSA.value],
                  variations: [],
                  pronunciation: '',
                  word: `${cleanedKey}-dialect`,
                },
              ];
              return createWord(word, connection);
            })
          );
        })
      )
    );
    const nsibidiCharacters = await Promise.all(
      nsibidiDictionary.map(({ sym, pro, form, defs }) => {
        const nsibidi = {
          nsibidi: sym,
          definitions: [{ text: defs || '' }],
          pronunciation: pro || '',
          wordClass:
            Object.values(WordClass).find(({ nsibidiValue }) => nsibidiValue === form)?.nsibidiValue ||
            WordClass.ADJ.nsibidiValue,
          radicals: [],
        };
        return createNsibidiCharacter(nsibidi, connection);
      })
    );
    const examples = await Promise.all(
      flatten(
        map(keys(dictionary), async (key, index) => {
          // @ts-expect-error LegacyWord
          const value = dictionary[key];
          return map(value, (term) => {
            const example = {
              id: term.word,
              igbo: term.word,
              english: `translation of ${term.word}`,
              pronunciations: [],
              style: index % 3 ? ExampleStyleEnum.PROVERB : ExampleStyleEnum.NO_STYLE,
              associatedWords: [words[index].id],
              associatedDefinitionsSchemas: [],
              nsibidiCharacters: [],
              updatedAt: new Date(),
            };
            return createExample(example, connection);
          });
        })
      )
    );

    /* Waits for all the MongoDB document save promises to resolve */
    try {
      /* Wait 15 seconds to allow the data to be written to database */
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          console.green('✅ Seeding successful');
          if (process.env.NODE_ENV === 'production') {
            resolve();
            process.exit(0);
          } else {
            resolve();
          }
        }, WRITE_DB_DELAY);
      });
    } catch (err) {
      console.red('🔴 Seeding failed', err);
    }
    return [words, nsibidiCharacters, examples];
  }
  return Promise.resolve();
};

const seed = () => {
  const connection = createDbConnection();
  connection.on('error', console.error.bind(console, 'connection error:'));
  return new Promise<void>((resolve) => {
    connection.once('connected', async () => {
      console.green('🗄 Database is connected');
      await populate(connection);
      await handleCloseConnection(connection);
      return resolve();
    });
  });
};

const sendResponseAndEndServer = (res: Response) => {
  res.redirect('/');
  return setTimeout(() => {
    console.log('💡 Restarting the server');
    return process.exit(0);
  }, 2000);
};

export const seedDatabase: MiddleWare = async (_, res, next) => {
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
