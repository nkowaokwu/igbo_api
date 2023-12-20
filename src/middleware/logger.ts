import chalk from 'chalk';
import { MiddleWare } from '../types';

const logger: MiddleWare = async (req, _, next) => {
  console.blue('-----------');
  console.log(chalk.blue('Query:'), req.query);
  console.blue('-----------');
  next();
};

export default logger;
