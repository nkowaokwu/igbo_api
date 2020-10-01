import mongoose from 'mongoose';
import childProcess from 'child_process';
import { map, flatten, keys } from 'lodash';
import { createWord } from '../controllers/words';
import dictionary from './ig-en/ig-en.json';
import { MONGO_URI, MONGO_ROOT } from '../config';

const WRITE_DB_DELAY = 15000;
const CLOSE_CONNECTION_DELAY = 3000;

const exec = childProcess.execSync;

/* Closes the connection to MongoDB */
const killMongod = () => {
    if (process.platform !== 'win32') {
        // Mongo syntax for non-Windows machines
        exec(`ttab -t "Close mongo" mongo ${MONGO_ROOT}/admin --eval "db.shutdownServer()"`);
    } else {
        // Mongo syntax for Windows machines
        exec('start cmd.exe /K mongo ${MONGO_ROOT}/admin --eval "db.shutdownServer()"')
    }
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', async () => {
    console.log(process.platform)
    console.log('🗄 Database is connected');

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
                    killMongod();
                    /* Wait an extra 3 seconds to allow the success message to appear
                    at the bottom of the terminal */
                    setTimeout(() => {
                        exec('echo "✅ Seeding successful. You can close the other terminal window"');
                        process.exit(10);
                    }, CLOSE_CONNECTION_DELAY);
                }, WRITE_DB_DELAY);
            })
            .catch((err) => {
                console.log('🔴 Seeding failed', err);
            });
        
    }
});