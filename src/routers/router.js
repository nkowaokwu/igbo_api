import express from 'express';
import { getWords } from '../controllers/words';

const router = express.Router();

/**
 * @swagger
 * /search/words:
 *   get:
 *     description: Get words in dictionary
  *     tags:
 *      - production
 *     parameters:
 *      - name: keyword
 *        description: keyword for querying dictionary
 *        in: query
 *        required: false
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
router.get('/words', getWords);

export default router;
