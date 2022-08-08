module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions', 'genericwords'];
    return collections.map(async (collection) => {
      db.collection(collection).updateMany({}, [
        {
          $set: {
            tags: [],
          },
        },
      ]);
    });
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions', 'genericwords'];
    return collections.map(async (collection) => {
      db.collection(collection).updateMany({}, [
        {
          $unset: ['tags'],
        },
      ]);
    });
  },
};
