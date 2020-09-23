import express from 'express';

const app = express();
const router = express.Router();
const port = 8080;

app.get('/', (_, res) => {
    res.send('Hello World!');
});

router.get('/', (_, res) => {
    res.send('Welcome to the Igbo English Dictionary API');
});

router.get('/search', (_, res) => {
    res.send('🚧 Work in progress 🚧');
});

app.use('/api/v1', router);

app.listen(port, () => {
    console.log(`🟢 Server started on port ${port}`);
});