import mongoose from 'mongoose';
import { map, flatten, keys } from 'lodash';
import { createWord } from '../controllers/words';
// import dictionary from './ig-en/ig-en.json';
import dictionary from './ig-en/ig-en_new_expanded.json';
import { MONGO_URI } from '../config';

const WRITE_DB_DELAY = 15000;

const populate = async () => {
  /* This route will populate a local MongoDB database */
  if (process.env.NODE_ENV !== 'production') {
    console.log('🌱 Seeding database...');
    mongoose.connection.db.dropDatabase();
    const wordPromises = flatten(
      map(keys(dictionary), (key) => {
        const value = dictionary[key];
        return map(value, (term) => {
          const word = { ...term };
          word.word = key;
          return createWord(word);
        });
      }),
    );
    /* Waits for all the MongoDB document save promises to resolve */
    await Promise.all(wordPromises)
      .then(() => {
        /* Wait 15 seconds to allow the data to be written to database */
        setTimeout(() => {
          console.log('✅ Seeding successful');
          if (process.env.NODE_ENV !== 'test') {
            process.exit(0);
          }
        }, WRITE_DB_DELAY);
      })
      .catch((err) => {
        console.log('🔴 Seeding failed', err);
      });
  }
};

const seed = () => {
  if (mongoose.connection.readyState !== 1) {
    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', async () => {
      console.log('🗄 Database is connected');
      populate();
    });
  } else {
    populate();
  }
};

export const seedDatabase = async (_, res) => {
  try {
    seed();
    return res.redirect('/');
  } catch (err) {
    res.status(400);
    return res.send('An error occurred during seeding');
  }
};
