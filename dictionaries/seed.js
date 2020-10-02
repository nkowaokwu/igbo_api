import mongoose from 'mongoose';
import { map, flatten, keys } from 'lodash';
import { createWord } from '../controllers/words';
import dictionary from './ig-en/ig-en.json';
import { MONGO_URI, TEST_MONGO_URI } from '../config';

const WRITE_DB_DELAY = 15000;

export const seedDatabase = async (_, res) => {
    try {
        seed();
        return res.redirect('/');
    } catch (err) {
        res.status(400);
        return res.send('An error occurred during seeding');
    }
}

const seed = () => {
    if (mongoose.connection.readyState !== 1) {
        mongoose.connect(process.env.NODE_ENV === 'test' ? TEST_MONGO_URI : MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, "connection error:"));
        db.once('open', async () => {
            console.log('🗄 Database is connected');
            populate();
        });
    } else {
        populate();
    }
}

const populate = async () => {
    /* This route will populate a local MongoDB database */
    if (process.env.NODE_ENV !== 'prod') {
        console.log('🌱 Seeding database...');
        mongoose.connection.db.dropDatabase();
        const wordPromises = flatten(map(keys(dictionary), (key) => {
            const value = dictionary[key];
            return map(value, (term) => {
                term.word = key
                createWord(term);
            });
        }));
        /* Waits for all the MongoDB document save promises to resolve */
        await Promise.all(wordPromises)
            .then(() => {
                /* Wait 15 seconds to allow the data to be written to database */
                setTimeout(() => {
                    console.log('✅ Seeding successful');
                    process.exit(0);
                }, WRITE_DB_DELAY);
            })
            .catch((err) => {
                console.log('🔴 Seeding failed', err);
            });
        
    }
}