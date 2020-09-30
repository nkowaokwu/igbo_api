const mainPath = `${__dirname}/../..`;
export const READ_FILE = `${mainPath}/dictionaries/html/dictionary.html`;
export const READ_FILE_FORMAT = 'utf8';

export const DICTIONARIES_DIR = process.env.NODE_ENV === 'test' ?
`${mainPath}/tests/__mocks__/dictionaries` : `${mainPath}/dictionaries/ig-en`;