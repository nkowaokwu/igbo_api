import express from 'express';
import mongoose from 'mongoose';
import { getWordData } from './controllers/words';
import { SERVER_PORT, MONGO_URI } from './config';

const app = express();
const router = express.Router();

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function() {
    console.log('🗄 Database is connected');
});

app.get('/', (_, res) => {
    res.send('Hello World!');
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

const server = app.listen(SERVER_PORT, () => {
    console.log(`🟢 Server started on port ${SERVER_PORT}`);
});

export default server;