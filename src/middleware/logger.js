import chalk from 'chalk';

export default (req, _, next) => {
  console.blue('-----------');
  console.log(chalk.blue('Query:'), req.query);
  console.blue('-----------');
  next();
};
