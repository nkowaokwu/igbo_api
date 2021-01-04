import createRegExp from './createRegExp';

/* Either creates a regex pattern for provided searchWord
or fallbacks to matching every word */
export default (searchWord) => (!searchWord ? /./ : createRegExp(searchWord));
