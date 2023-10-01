import { Express } from '../../types';

export const logout: Express.MiddleWare = async (req, res) => {
  res.cookie('jwt', '', { expires: new Date(0), httpOnly: true });

  const message = 'Logged out successfully';
  return res.status(200).send({
    message,
  });
};
