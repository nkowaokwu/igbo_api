/* Removes the verb prefix character '-' */
export default (term): string => {
  if (term && term.charAt(0) === '-') {
    return term.substring(1);
  }
  return term;
};
