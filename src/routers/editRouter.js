import express from 'express';
import {
  getWordSuggestion,
  getWordSuggestions,
  postWordSuggestion,
  putWordSuggestion,
} from '../controllers/wordSuggestions';
import {
  getExampleSuggestion,
  getExampleSuggestions,
  postExampleSuggestion,
  putExampleSuggestion,
} from '../controllers/exampleSuggestions';
import { createGenericWords } from '../controllers/genericWords';

const editRouter = express.Router();

/* These routes are used to allow users to suggest new words and examples */
if (process.env.NODE_ENV !== 'production') { // TODO: remove this guard rail when releasing for production
  /**
 * @swagger
 * /edit/words:
 *   post:
 *     description: Creates a new WordSuggestion document
 *     tags:
 *      - development
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The word suggestion that will be created in the database
 *         schema:
 *           type: object
 *           properties:
 *             word:
 *               type: string
 *             wordClass:
 *               type: string
 *             definitions:
 *               type: array
 *               items:
 *                 type: string
 *             variations:
 *               type: array
 *               items:
 *                 type: string
 *     responses:
 *      200:
 *         description: OK
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                type: string
 *   put:
 *      description: Updates an existing WordSuggestion document
 *      tags:
 *       - development
 *      consumes:
 *        - application/json
 *      parameters:
 *       - in: body
 *         name: body
 *         description: The updated word suggested data
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             word:
 *               type: string
 *             wordClass:
 *               type: string
 *             definitions:
 *               type: array
 *               items:
 *                 type: string
 *             variations:
 *               type: array
 *               items:
 *                 type: string
 *      responses:
 *        200:
 *         description: OK
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *   get:
 *      description: Returns all WordSuggestion objects in the database
 *      tags:
 *       - development
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *         description: OK
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *
 * /edit/words/{wordSuggestionId}:
 *    get:
 *      description: Returns a single WordSuggestion object from the database
 *      tags:
 *       - development
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: wordSuggestionId
 *          required: true
 *          schema:
 *            type: string
 *          description: the wordSuggestion id
 *      responses:
 *        200:
 *         description: OK
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 */
  editRouter.post('/words', postWordSuggestion);
  editRouter.put('/words', putWordSuggestion);
  editRouter.get('/words', getWordSuggestions);
  editRouter.get('/words/:id', getWordSuggestion);

  /**
 * @swagger
 * /edit/examples:
 *   post:
 *     description: Creates a new ExampleSuggestion document
 *     tags:
 *      - development
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The example suggestion that will be created in the database
 *         schema:
 *           type: object
 *           properties:
 *             igbo:
 *               type: string
 *             english:
 *               type: string
 *             associatedWords:
 *               type: array
 *               items:
 *                 type: string
 *     responses:
 *      200:
 *         description: OK
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                type: string
 *   put:
 *      description: Updates and existing ExampleSuggestion document
 *      tags:
 *       - development
 *      consumes:
 *        - application/json
 *      parameters:
 *       - in: body
 *         name: body
 *         description: The updated example suggested data
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             igbo:
 *               type: string
 *             english:
 *               type: string
 *             associatedWords:
 *               type: array
 *               items:
 *                 type: string
 *      responses:
 *        200:
 *         description: OK
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *   get:
 *      description: Returns all ExampleSuggestion objects in the database
 *      tags:
 *       - development
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *         description: OK
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *
 * /edit/examples/{exampleSuggestionId}:
 *    get:
 *      description: Returns a single ExampleSuggestion object from the database
 *      tags:
 *       - development
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: exampleSuggestionId
 *          required: true
 *          schema:
 *            type: string
 *          description: the exampleSuggestion id
 *      responses:
 *        200:
 *         description: OK
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 */
  editRouter.post('/examples', postExampleSuggestion);
  editRouter.put('/examples', putExampleSuggestion);
  editRouter.get('/examples', getExampleSuggestions);
  editRouter.get('/examples/:id', getExampleSuggestion);

  /**
 * @swagger
 * /edit/genericWords:
 *   post:
 *     description: Populates the database with GenericWords using ig-en_normalized_expanded.json
 *     tags:
 *      - development
 *     consumes:
 *       - application/json
 *     responses:
 *      200:
 *         description: OK
 */
  editRouter.post('/genericWords', createGenericWords);
}

export default editRouter;
