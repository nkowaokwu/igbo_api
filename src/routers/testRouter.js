import express from 'express';
import { getWordData } from '../controllers/words';
import { seedDatabase } from '../dictionaries/seed';

const testRouter = express.Router();

testRouter.get('/', (_, res) => {
  res.send('Welcome to the Igbo English Dictionary API');
});

/**
 * @swagger
 * /test/populate:
 *   post:
 *     description: Populate mongodb with json from ./ig-en/ig-en.json
 *     tags:
 *      - test
 *     responses:
 *       200:
 *         description: OK
 */
testRouter.post('/populate', seedDatabase);

/**
 * @swagger
 * /test/words:
 *   get:
 *     description: Get words in dictionary
 *     tags:
 *      - test
 *     parameters:
 *      - name: keyword
 *        description: keyword for querying dictionary
 *        in: query
 *        required: true
 *        type: string
 *      - name: page
 *        description: page for results
 *        in: query
 *        required: false
 *        type: integer
 *     responses:
 *      200:
 *         description: OK
 */
testRouter.get('/words', getWordData);

export default testRouter;
