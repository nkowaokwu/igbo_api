import express from 'express';
import { postWordSuggestion, putWordSuggestion } from '../controllers/wordSuggestions';
import { postExampleSuggestion, putExampleSuggestion } from '../controllers/exampleSuggestions';

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
 */
  editRouter.post('/words', postWordSuggestion);
  editRouter.put('/words', putWordSuggestion);

  /**
 * @swagger
 * /edit/example:
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
 */
  editRouter.post('/examples', postExampleSuggestion);
  editRouter.put('/examples', putExampleSuggestion);
}

export default editRouter;
