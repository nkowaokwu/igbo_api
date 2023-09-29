import { Express } from '../../types';

export const logout: Express.MiddleWare = async (req, res) => {
  const message = 'Logged out successfully';
  return res.status(200).send({
    message,
  });
};
