module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions', 'genericwords'];
    return collections.map(async (collection) => {
      db.collection(collection).updateMany({}, [
        {
          $set: {
            relatedTerms: { $setUnion: ['$synonyms', '$antonyms'] },
          },
        },
        {
          $unset: ['synonyms', 'antonyms'],
        },
      ]);
    });
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions', 'genericwords'];
    return collections.map(async (collection) => {
      db.collection(collection).updateMany({}, [
        {
          $set: {
            synonyms: '$relatedTerms',
            antonyms: [],
          },
        },
        {
          $unset: ['relatedTerms'],
        },
      ]);
    });
  },
};
