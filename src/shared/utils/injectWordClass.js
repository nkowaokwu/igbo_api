import WordClass from '../constants/WordClass';

export default (swaggerJson) => ({
  ...swaggerJson,
  definitions: {
    ...swaggerJson.definitions,
    WordClass: {
      ...swaggerJson.definitions.WordClass,
      enum: Object.values(WordClass).map(({ value }) => value),
      description: Object.values(WordClass).map(({ value, label }) => `${value} - ${label}`).join('\n'),
    },
  },
});
