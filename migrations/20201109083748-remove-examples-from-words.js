module.exports = {
  async up(db) {
    const collections = ['words'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $unset: { examples: null },
      })
    ));
  },

  async down(db) {
    const collections = ['words'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $set: { examples: [] },
      })
    ));
  },
};
