const LEFT_COLUMN_STYLE_VALUE = 57.6;
const CENTER_COULMN_STYLE_VALUE = 159.72;
const RIGHT_COLUMN_STYLE_VALUE = 262.02;

export const SAME_CELL_TOP_DIFFERENCE = 15;
export const COLUMNS = {
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right',
};
export const LEFT_STYLE_TO_COLUMN = {
    [LEFT_COLUMN_STYLE_VALUE]: COLUMNS.LEFT,
    [CENTER_COULMN_STYLE_VALUE]: COLUMNS.CENTER,
    [RIGHT_COLUMN_STYLE_VALUE]: COLUMNS.RIGHT,
};
export const CELL_TYPE = {
    WORD: 'word',
    WORD_CLASS: 'wordClass',
    PHRASE: 'phrase',
    DEFINITION: 'definition',
    EXAMPLE: 'example',
};