import express from 'express';
import mongoose from 'mongoose';
import { getWordData } from './controllers/words';
import { createWord } from './controllers/words';
import dictionary from './dictionaries/ig-en/ig-en.json';

const app = express();
const router = express.Router();
const port = 8080;
const dbName = 'igbo_api';
const url = `mongodb://localhost:27017/${dbName}`;

mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function() {
    console.log('🗄 Database is connected');
});

app.get('/', (_, res) => {
    res.send('Hello World!');
});

/* This route will populate a local MongoDB database */
app.post('/populate', (_, res) => {
    if (process.env.NODE_ENV === 'dev') {
        mongoose.connection.db.dropDatabase();
        for(const key in dictionary) {
            const value = dictionary[key];
            value.forEach((term) => {
                term.word = key
                createWord(term);
            });
        }
    }
    res.redirect('/');
});

router.get('/', (_, res) => {
    res.send('Welcome to the Igbo English Dictionary API');
});

router.get('/words', getWordData);

app.use('*', (req, _, next) => {
    if (process.env.NODE_ENV === 'dev') {
        console.log(req.query);
    }
    next();
});
app.use('/api/v1/search', router);

app.use((err, req, res) => {
    res.send(err.message);
});

const server = app.listen(port, () => {
    console.log(`🟢 Server started on port ${port}`);
});

export default server;