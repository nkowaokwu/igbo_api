import chalk from 'chalk';
import { NextFunction, Request } from 'express';

export default (req: Request, _, next: NextFunction) => {
  console.blue('-----------');
  console.log(chalk.blue('Query:'), req.query);
  console.blue('-----------');
  next();
};
