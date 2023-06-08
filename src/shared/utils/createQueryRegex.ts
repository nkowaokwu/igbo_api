import createRegExp, { SearchRegExp } from './createRegExp';

/* Either creates a regex pattern for provided searchWord
or fallbacks to matching every word */
export default (searchWord): SearchRegExp => (
  !searchWord ? { wordReg: /./, definitionsReg: /./, hardDefinitionsReg: /./ } : createRegExp(searchWord)
);
