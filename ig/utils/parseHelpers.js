import { flatten } from 'lodash';

export const getLeftStyle = (element) => {
    const styles = element.getAttribute('style');
    const leftStyle = styles.split(';')[1];
    return leftStyle.split(':')[1];
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
