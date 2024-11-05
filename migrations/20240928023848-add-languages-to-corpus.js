module.exports = {
  async up(db) {
    const collections = ['corpus', 'corpussuggestions'];
    return collections.map((collection) =>
      db.collection(collection).updateMany(
        {},
        {
          $set: { languages: [] },
        }
      )
    );
  },

  async down(db) {
    const collections = ['corpus', 'corpussuggestions'];
    return collections.map((collection) =>
      db.collection(collection).updateMany(
        {},
        {
          $unset: { languages: null },
        }
      )
    );
  },
};
