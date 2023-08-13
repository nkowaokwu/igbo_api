import chalk from 'chalk';
import { Express } from '../types';

const logger: Express.MiddleWare = async (req, _, next) => {
  console.blue('-----------');
  console.log(chalk.blue('Query:'), req.query);
  console.blue('-----------');
  next();
};

export default logger;
