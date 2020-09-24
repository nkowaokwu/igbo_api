import express from 'express';
import { getWordData } from './controllers/words';

const app = express();
const router = express.Router();
const port = 8080;

app.get('/', (_, res) => {
    res.send('Hello World!');
});

router.get('/', (_, res) => {
    res.send('Welcome to the Igbo English Dictionary API');
});

router.get('/words', getWordData);

app.use('/api/v1/search', router);

app.use((err, req, res, next) => {
    res.send(err.message);
})

// If statement enables mocha --watch
if (!module.children) {
    app.listen(port, () => {
        console.log(`🟢 Server started on port ${port}`);
    });
}

export default app;