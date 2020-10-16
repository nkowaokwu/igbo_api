import express from 'express';
import { getWords, postWord } from '../controllers/words';
import { getExamples, postExample } from '../controllers/examples';

const router = express.Router();

/**
 * @swagger
 * /words:
 *   get:
 *     description: Get words in dictionary
  *     tags:
 *      - production
 *     parameters:
 *      - name: keyword
 *        description: keyword for querying words
 *        in: query
 *        required: false
 *        type: string
 *      - name: page
 *        description: page for results
 *        in: query
 *        required: false
 *        type: integer
 *      - name: range
 *        description: page for results using [x,y] syntax
 *        in: query
 *        required: false
 *        type: string
 *     responses:
 *      200:
 *         description: OK
 *
 * /examples:
 *   get:
 *     description: Get examples in dictionary
  *     tags:
 *      - production
 *     parameters:
 *      - name: keyword
 *        description: keyword for querying examples
 *        in: query
 *        required: false
 *        type: string
 *      - name: page
 *        description: page for results
 *        in: query
 *        required: false
 *        type: integer
 *      - name: range
 *        description: page for results using [x,y] syntax
 *        in: query
 *        required: false
 *        type: string
 *     responses:
 *      200:
 *         description: OK
 */
router.get('/words', getWords);
router.get('/examples', getExamples);

if (process.env.NODE_ENV !== 'production') {
  router.post('/words', postWord);
  router.post('/examples', postExample);
}

export default router;
