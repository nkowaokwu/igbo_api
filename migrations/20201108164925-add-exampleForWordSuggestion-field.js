module.exports = {
  async up(db) {
    const collections = ['examplesuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $set: { exampleForWordSuggestion: false },
      })
    ));
  },

  async down(db) {
    const collections = ['examplesuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $unset: { exampleForWordSuggestion: false },
      })
    ));
  },
};
