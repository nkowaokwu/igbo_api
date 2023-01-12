module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $set: { 'attributes.isCommon': false },
      })
    ));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $unset: { 'attributes.isCommon': null },
      })
    ));
  },
};
