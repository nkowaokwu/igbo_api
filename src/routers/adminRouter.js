import express from 'express';
import { getUser, getUsers, testGetUsers } from '../controllers/users';

const adminRouter = express.Router();

adminRouter.get('/users', process.env.NODE_ENV === 'test' ? testGetUsers : getUsers);
adminRouter.get('/users/:uid', getUser);

export default adminRouter;
