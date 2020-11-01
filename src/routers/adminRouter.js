import express from 'express';
import { addEditor, addMerger, addAdmin } from '../controllers/admin';

const adminRouter = express.Router();

adminRouter.post('/addEditor', addEditor);
adminRouter.post('/addMerger', addMerger);
adminRouter.post('/addAdmin', addAdmin);

export default adminRouter;
