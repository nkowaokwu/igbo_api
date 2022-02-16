const wordsMigrationPipeline = [
  {
    $match: {
      word: {
        $regex: '^-',
        $options: 'i',
      },
      wordClass: {
        $in: ['AV', 'PV', 'MV'],
      },
    },
  }, {
    $set: {
      word: {
        $function: {
          // eslint-disable-next-line
          body: 'function(word) { let updatedWord = word; if (word.startsWith(\'-\')) { updatedWord = word.substring(1); } return updatedWord; }', 
          args: ['$word'],
          lang: 'js',
        },
      },
    },
  },
];

const wordsRevertPipeline = [
  {
    $match: {
      wordClass: {
        $in: ['AV', 'PV', 'MV'],
      },
    },
  }, {
    $set: {
      word: {
        $function: {
          body: 'function(word) { if (!word.startsWith(\'-\')) { return \'-\' + word; } return word; }',
          args: ['$word'],
          lang: 'js',
        },
      },
    },
  },
];

module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    await Promise.all(
      collections.map(async (collection) => {
        const wordDocs = await (await db.collection(collection).aggregate(wordsMigrationPipeline)).toArray();
        await Promise.all(wordDocs.map((wordDoc) => (
          db.collection(collection).updateOne(
            // eslint-disable-next-line
            { _id: wordDoc._id },
            { $set: { word: wordDoc.word } },
          )
        )));
      }));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    await Promise.all(
      collections.map(async (collection) => {
        const wordDocs = await (await db.collection(collection).aggregate(wordsRevertPipeline)).toArray();
        await Promise.all(wordDocs.map((wordDoc) => (
          db.collection(collection).updateOne(
            // eslint-disable-next-line
            { _id: wordDoc._id },
            { $set: { word: wordDoc.word } },
          )
        )));
      }));
  },
};
