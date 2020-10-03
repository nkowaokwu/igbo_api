import express from 'express';
import mongoose from 'mongoose';
import { testRouter, router } from './routers';
import logger from './middleware/logger';
import { SERVER_PORT, MONGO_URI, TEST_MONGO_URI } from './config';

const app = express();

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

app.use('*', logger);

/* Grabs data from JSON dictionary */
app.use('/api/v1/search', router);

/* Grabs data from MongoDB */
if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
    app.use('/api/v1/test', testRouter);
}

const server = app.listen(SERVER_PORT, () => {
    console.log(`🟢 Server started on port ${SERVER_PORT}`);
});

server.clearDatabase = () => {
    mongoose.connection.db.dropDatabase();
};

export default server;