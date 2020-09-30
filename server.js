import express from 'express';
import mongodb from 'mongodb';
import { getWordData } from './controllers/words';

const { MongoClient } = mongodb;
const app = express();
const router = express.Router();
const port = 8080;
const url = 'mongodb://localhost:27017';
const dbName = 'igbo_api';

MongoClient.connect(url, (_, client) => {
    console.log('🗄 Database is connected');
    client.db(dbName);
});

app.get('/', (_, res) => {
    res.send('Hello World!');
});

router.get('/', (_, res) => {
    res.send('Welcome to the Igbo English Dictionary API');
});

router.get('/words', getWordData);

app.use('*', (req, res, next) => {
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