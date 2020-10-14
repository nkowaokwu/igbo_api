import { flatten, last } from 'lodash';

/* Converts the style's value into a float */
const getStyleValues = (style = '') => parseFloat(style.split(':')[1]);

/* Takes out the top and left styles from the element's style attribute */
export const getLeftAndTopStyles = (element) => {
  const styleAttribute = element.getAttribute('style');
  const leftStyleMatches = styleAttribute.match(/left:\d{1,}.\d{1,}/) || [];
  const topStyleMatches = styleAttribute.match(/top:\d{1,}.\d{1,}/) || [];
  return {
    left: getStyleValues(leftStyleMatches[0]),
    top: getStyleValues(topStyleMatches[0]),
  };
};

export const getChildrenText = (element) => {
  const children = element.childNodes;
  const childrenText = flatten(
    children.map((child) => (
      child.childNodes.map((childNode) => childNode.rawText)
    )),
  );
  return childrenText.join('');
};

/* Checks to see if current text is one of many definitions for a term */
export const startsWithLetterDot = (text) => (
  text.startsWith('A. ') || text.startsWith('B. ') || text.startsWith('C. ') || text.startsWith('D. ')
);

/* Append the childrenText to the the current cell associated with a term */
export const appendTextToCurrentCell = (childrenText, termArray) => {
  const isABBeginning = startsWithLetterDot(childrenText);
  if (isABBeginning) {
    termArray.push(childrenText);
  } else {
    const currentDefinition = last(termArray);
    const lastIndex = termArray.length - 1;
    // eslint-disable-next-line no-param-reassign
    termArray[lastIndex] = `${currentDefinition} ${childrenText}`;
  }
};

/* Helps with testing parsing script
Usages: printData('-kwùchi', { text: childrenText, isSameCell, isSameRow, prevColumn, prevCellType });
*/
export const printData = (text, data) => {
  if (data.text.startsWith(text)) {
    console.log(data);
  }
};
