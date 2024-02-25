import createRegExp, { SearchRegExp } from './createRegExp';

/* Either creates a regex pattern for provided searchWord
or fallbacks to matching every word */
export default (searchWord: string): SearchRegExp =>
  !searchWord
    ? { wordReg: /./, exampleReg: /./, definitionsReg: /./, hardDefinitionsReg: /./ }
    : createRegExp(searchWord);
