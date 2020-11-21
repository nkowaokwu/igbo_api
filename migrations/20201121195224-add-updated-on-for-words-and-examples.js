module.exports = {
  async up(db) {
    const collections = ['words', 'examples'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $set: { updatedOn: Date.now() },
      })
    ));
  },

  async down(db) {
    const collections = ['words', 'examples'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $unset: { updatedOn: null },
      })
    ));
  },
};
