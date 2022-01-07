module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions', 'genericwords'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $set: { nsibidi: '' },
      })
    ));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions', 'genericwords'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $unset: { nsibidi: null },
      })
    ));
  },
};
