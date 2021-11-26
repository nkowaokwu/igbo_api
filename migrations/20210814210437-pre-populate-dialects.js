const dialectKeys = [
  'NSA',
  'UMU',
  'ANI',
  'OKA',
  'AFI',
  'MBA',
  'EGB',
  'OHU',
  'ORL',
  'NGW',
  'OWE',
  'NSU',
  'BON',
  'OGU',
  'ONI',
  'ECH',
  'UNW',
];

module.exports = {
  async up(db) {
    const collections = ['words', 'wordSuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [{
        $set: dialectKeys.reduce((finalSet, dialectKey) => ({
          ...finalSet,
          [`dialects.${dialectKey}.word`]: {
            $cond: {
              if: { $eq: [`$dialects.${dialectKey}.word`, ''] },
              then: '$accented',
              else: `$dialects.${dialectKey}.accented`,
            },
          },
          [`dialects.${dialectKey}.accented`]: {
            $cond: {
              if: { $eq: [`$dialects.${dialectKey}.accented`, ''] },
              then: '$accented',
              else: `$dialects.${dialectKey}.accented`,
            },
          },
        }), {}),
      }])
    ));
  },

  async down(db) {
    const collections = ['words', 'wordSuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [{
        $set: { word: '$word' },
      }])
    ));
  },
};
