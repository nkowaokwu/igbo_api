module.exports = {
  async up(db) {
    const collections = ['wordsuggestions', 'examplesuggestions', 'genericwords'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $set: { mergedBy: null },
      })
    ));
  },

  async down(db) {
    const collections = ['wordsuggestions', 'examplesuggestions', 'genericwords'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $unset: { mergedBy: null },
      })
    ));
  },
};
