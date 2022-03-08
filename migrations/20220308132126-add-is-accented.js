module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({ isComplete: true }, {
        $set: { isAccented: true, isComplete: false },
      })
    ));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({ isAccented: true }, {
        $unset: { isAccented: null },
        $set: { isComplete: true },
      })
    ));
  },
};
