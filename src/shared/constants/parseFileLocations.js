const mainPath = `${__dirname}/../..`;
export const READ_FILE_FORMAT = 'utf8';

export const DICTIONARIES_DIR = process.env.NODE_ENV === 'test'
  ? `${mainPath}/../__tests__/__mocks__/dictionaries` : `${mainPath}/dictionaries/ig-en`;
export const BUILD_DICTIONARIES_DIR = `${mainPath}/../dist/dictionaries/ig-en`;
