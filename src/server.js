import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { editorRouter, router, testRouter } from './routers';
import logger from './middleware/logger';
import { PORT, MONGO_URI, SWAGGER_OPTIONS } from './config';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('🗄 Database is connected');
});

app.use(cors({
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
}));

app.use('*', logger);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(SWAGGER_OPTIONS)));

/* Grabs data from MongoDB */
app.use('/api/v1', router);

// TODO: remove this guard rail when releasing for production
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/v1', editorRouter);
}

/* Grabs data from JSON dictionary */
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/v1/test', testRouter);
}

const server = app.listen(PORT, () => {
  console.log(`🟢 Server started on port ${PORT}`);
});

server.clearDatabase = () => {
  mongoose.connection.db.dropDatabase();
};

export default server;
