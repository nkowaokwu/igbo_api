import express from 'express';
import {
  getWordSuggestion,
  getWordSuggestions,
  postWordSuggestion,
  putWordSuggestion,
} from '../controllers/wordSuggestions';
import { putWord, postWord, deleteWord } from '../controllers/words';
import { putExample, postExample, getExamples } from '../controllers/examples';
import {
  getExampleSuggestion,
  getExampleSuggestions,
  postExampleSuggestion,
  putExampleSuggestion,
} from '../controllers/exampleSuggestions';
import {
  getGenericWords,
  createGenericWords,
  putGenericWord,
  getGenericWord,
} from '../controllers/genericWords';

const editorRouter = express.Router();

/* These routes are used to allow users to suggest new words and examples */

/**
* @swagger
* /words:
*   post:
*     description: Creates a new Word document
*     tags:
*      - development
*     consumes:
*       - application/json
*     parameters:
*       - in: body
*         name: body
*         description: The word that will be created in the database
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
*   responses:
*        200:
*         description: OK
*         content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                id:
*                type: string
*
*/
editorRouter.post('/words', postWord);

/**
* @swagger
* /words/{wordId}:
*   put:
*     description: Updates a Word object from the database
*     tags:
*      - production
*     consumes:
*       - application/json
*     parameters:
*        - in: path
*          name: wordId
*          required: true
*          schema:
*            type: string
*          description: the word id
*        - in: body
*          name: body
*          description: The updated word data
*          schema:
*             type: object
*             properties:
*              id:
*                type: string
*              word:
*                type: string
*              wordClass:
*                type: string
*              definitions:
*                type: array
*                items:
*                  type: string
*              variations:
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
*/
editorRouter.put('/words/:id', putWord);

/**
* @swagger
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
editorRouter.get('/examples', getExamples);

/**
* @swagger
* /examples:
*   post:
*     description: Creates a new Example document
*     tags:
*      - development
*     consumes:
*       - application/json
*     parameters:
*       - in: body
*         name: body
*         description: The example that will be created in the database
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
*   responses:
*      200:
*       description: OK
*/
editorRouter.post('/examples', postExample);

/**
* @swagger
* /examples/{exampleId}:
*   put:
*     description: Updates a Example object from the database
*     tags:
*      - production
*     consumes:
*       - application/json
*     parameters:
*        - in: path
*          name: exampleId
*          required: true
*          schema:
*            type: string
*          description: the example id
*        - in: body
*          name: body
*          description: The updated example data
*          schema:
*            type: object
*            properties:
*              id:
*                type: string
*              igbo:
*                type: string
*              english:
*                type: string
*              associatedWords:
*                type: array
*                items:
*                  type: string
*     responses:
*      200:
*         description: OK
*/
editorRouter.put('/examples/:id', putExample);

/**
* @swagger
* /wordSuggestions:
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
*            type: object
*            properties:
*              word:
*               type: string
*              wordClass:
*               type: string
*              definitions:
*               type: array
*               items:
*                 type: string
*               variations:
*                type: array
*                items:
*                   type: string
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
*/
editorRouter.post('/wordSuggestions', postWordSuggestion);

/**
* @swagger
* /wordSuggestions:
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
*/
editorRouter.get('/wordSuggestions', getWordSuggestions);

/**
* @swagger
* /wordSuggestions/{wordSuggestionId}:
*   get:
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
editorRouter.get('/wordSuggestions/:id', getWordSuggestion);

/**
* @swagger
* /wordSuggestions/{wordSuggestionId}:
*   put:
*      description: Updates an existing WordSuggestion document
*      tags:
*       - development
*      consumes:
*        - application/json
*      parameters:
*       - in: path
*         name: wordSuggestionId
*         required: true
*         schema:
*           type: string
*         description: the wordSuggestion id
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
*
*/
editorRouter.put('/wordSuggestions/:id', putWordSuggestion);

/**
 * @swagger
 * /exampleSuggestions:
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
 */
editorRouter.post('/exampleSuggestions', postExampleSuggestion);

/**
* @swagger
* /exampleSuggestions:
*    get:
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
*/
editorRouter.get('/exampleSuggestions', getExampleSuggestions);

/**
* @swagger
* /exampleSuggestions/{exampleSuggestionId}:
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
editorRouter.get('/exampleSuggestions/:id', getExampleSuggestion);

/**
* @swagger
* /exampleSuggestions/{exampleSuggestionId}:
*    put:
*      description: Updates and existing ExampleSuggestion document
*      tags:
*       - development
*      consumes:
*        - application/json
*      parameters:
*       - in: path
*         name: exampleSuggestionId
*         required: true
*         schema:
*           type: string
*         description: the exampleSuggestion id
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
editorRouter.put('/exampleSuggestions/:id', putExampleSuggestion);

/**
* @swagger
* /genericWords:
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
editorRouter.post('/genericWords', createGenericWords);

/**
* @swagger
* /genericWords:
*   get:
*     description: Gets all GenericWord objects from the database
*     tags:
*      - development
*     consumes:
*       - application/json
*     responses:
*      200:
*         description: OK
*/
editorRouter.get('/genericWords', getGenericWords);

/**
* @swagger
* /genericWords/{genericWordId}:
*   get:
*     description: Returns a single GenericWord object from the database
*     tags:
*      - development
*     consumes:
*       - application/json
*     parameters:
*        - in: path
*          name: genericWordId
*          required: true
*          schema:
*            type: string
*          description: the genericWord id
*     responses:
*      200:
*         description: OK
*/
editorRouter.get('/genericWords/:id', getGenericWord);

/**
* @swagger
* /genericWords/{genericWordId}:
*   put:
*      description: Updates an existing GenericWord document
*      tags:
*       - development
*      consumes:
*        - application/json
*      parameters:
*       - in: path
*         name: genericWordId
*         required: true
*         schema:
*           type: string
*         description: the genericWord id
*       - in: body
*         name: body
*         description: The updated generic word data
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
editorRouter.put('/genericWords/:id', putGenericWord);

/**
* @swagger
* /edit/words/{wordId}:
*   delete:
*     description: Deletes a word document from the production database
*     tags:
*      - development
*     consumes:
*       - application/json
*     parameters:
*        - in: path
*          name: wordId
*          required: true
*          schema:
*            type: string
*          description: the word id
*     responses:
*       200:
*         description: OK
*/
editorRouter.delete('/edit/words/:id', deleteWord);

export default editorRouter;
