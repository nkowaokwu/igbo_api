import express from 'express';
import { getUser, getUsers } from '../controllers/users';

const adminRouter = express.Router();

adminRouter.get('/users', getUsers);
adminRouter.get('/users/:uid', getUser);

export default adminRouter;
