const wordsMigrationPipeline = [
  {
    $match: {
      word: {
        $exists: true,
      },
    },
  },
  {
    $set: {
      dialects: {
        $function: {
          body: `function(word, dialects) {
            let slimmedDialects = Object.keys(dialects || {}).reduce(function(finalDialects, key) {
              let dialectsCopy = finalDialects;
              let value = dialects[key];
              if (word !== value.word && value.word && !dialectsCopy[value.word]) {
                 dialectsCopy[value.word] = {
                   variations: value.variations,
                   dialects: [key],
                   pronunciation: value.pronunciation,
                  };
                 return dialectsCopy;
              }
              return finalDialects;
            }, {});
            return slimmedDialects;
          }`,
          args: ['$word', '$dialects'],
          lang: 'js',
        },
      },
    },
  },
];

const wordsRevertPipeline = [
  {
    $match: {
      word: {
        $exists: true,
      },
    },
  },
  {
    $set: {
      dialects: {
        $function: {
          body: `function(word, dialects) {
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
            let revertedDialects = dialectKeys.reduce(function(finalDialects, dialect) {
              let dialectsCopy = finalDialects;
              dialectsCopy[dialect] = {
                word: word,
                variations: [],
                dialect: dialect,
                pronunciation: '',
              }
              return dialectsCopy;
            }, {});
            Object.keys(dialects).forEach(function(dialectWord) {
              let value = dialects[dialectWord];
              revertedDialects[value.dialects[0]] = {
                word: dialectWord,
                variations: value.variations,
                dialect: value.dialects[0],
                pronunciation: value.pronunciation,
              }
            })
            return revertedDialects;
          }`,
          args: ['$word', '$dialects'],
          lang: 'js',
        },
      },
    },
  },
];

module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions', 'genericwords'];
    await Promise.all(
      collections.map(async (collection) => {
        const wordDocs = await (await db.collection(collection).aggregate(wordsMigrationPipeline)).toArray();
        await Promise.all(wordDocs.map((wordDoc) => (
          db.collection(collection).updateOne(
            // eslint-disable-next-line
            { _id: wordDoc._id },
            { $set: { dialects: wordDoc.dialects } },
          )
        )));
      }));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions', 'genericwords'];
    await Promise.all(
      collections.map(async (collection) => {
        const wordDocs = await (await db.collection(collection).aggregate(wordsRevertPipeline)).toArray();
        await Promise.all(wordDocs.map((wordDoc) => (
          db.collection(collection).updateOne(
            // eslint-disable-next-line
            { _id: wordDoc._id },
            { $set: { dialects: wordDoc.dialects } },
          )
        )));
      }));
  },
};
