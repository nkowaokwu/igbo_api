import { flatten } from 'lodash';

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
    }
}

export const getChildrenText = (element) => {
    const children = element.childNodes;
    const childrenText = flatten(children.map((child) => {
        return child.childNodes.map((childNode) => {
            return childNode.rawText;
        });
    }));
    return childrenText.join('');
}
