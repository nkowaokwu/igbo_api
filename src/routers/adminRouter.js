import express from 'express';
import { getUsers } from '../controllers/users';

const adminRouter = express.Router();

adminRouter.get('/users', getUsers);

export default adminRouter;
