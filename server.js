import express from 'express';
import mongoose from 'mongoose';
import { getWordData, getWords } from './controllers/words';
import { seedDatabase } from './dictionaries/seed';
import { SERVER_PORT, MONGO_URI, TEST_MONGO_URI } from './config';

const app = express();
const router = express.Router();
const testRouter = express.Router();

mongoose.connect(process.env.NODE_ENV === 'test' ? TEST_MONGO_URI : MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
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

testRouter.post('/populate', seedDatabase);
testRouter.get('/words', getWords);

app.use('*', (req, _, next) => {
    if (process.env.NODE_ENV === 'dev') {
        console.log(req.query);
    }
    next();
});

/* Grabs data from JSON dictionary */
app.use('/api/v1/search', router);

/* Grabs data from MongoDB */
app.use('/api/v1/test', testRouter);

app.use((err, _, res) => {
    res.send(err.message);
});

const server = app.listen(SERVER_PORT, () => {
    console.log(`🟢 Server started on port ${SERVER_PORT}`);
});

server.clearDatabase = () => {
    mongoose.connection.db.dropDatabase();
};

export default server;