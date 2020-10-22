import express from 'express';
import { getWords, getWord } from '../controllers/words';
import { getExamples, getExample } from '../controllers/examples';

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
*/
router.get('/words', getWords);

/**
* @swager
* /words/{wordId}:
*   get:
*     description: Returns a single Word object from the database
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
*     responses:
*      200:
*         description: OK
*/
router.get('/words/:id', getWord);

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
router.get('/examples', getExamples);

/**
* @swagger
* /examples/{exampleId}:
*   get:
*     description: Returns a single Example object from the database
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
*     responses:
*      200:
*         description: OK
*/
router.get('/examples/:id', getExample);

export default router;
