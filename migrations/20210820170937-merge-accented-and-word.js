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
    const wordAccentedMigration = {
      word: {
        $cond: {
          if: {
            $and: [
              { $ne: ['$accented', ''] },
              { $ne: ['$accented', null] },
              { $ne: ['$accented', undefined] },
            ],
          },
          then: '$accented',
          else: '$word',
        },
      },
    };

    const nestedDialectsWordAccentedMigration = dialectKeys.reduce((finalSet, dialectKey) => ({
      ...finalSet,
      [`dialects.${dialectKey}.word`]: {
        $cond: {
          if: {
            $and: [
              { $ne: [`$dialects.${dialectKey}.accented`, ''] },
              { $ne: [`$dialects.${dialectKey}.accented`, null] },
              { $ne: [`$dialects.${dialectKey}.accented`, undefined] },
            ],
          },
          then: `$dialects.${dialectKey}.accented`,
          else: '$accented',
        },
      },
    }), {});

    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [{
        $set: {
          ...wordAccentedMigration,
          ...nestedDialectsWordAccentedMigration,
        },
      },
      {
        $unset: ['accented'].concat(dialectKeys.map((dialectKey) => `dialects.${dialectKey}.accented`)),
      }])
    ));
  },

  async down(db) {
    const collections = ['words', 'wordSuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [{
        $set: { word: '$word', accented: '$word' },
      }])
    ));
  },
};
