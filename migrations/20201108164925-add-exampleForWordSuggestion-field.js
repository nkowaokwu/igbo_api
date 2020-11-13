module.exports = {
  async up(db) {
    const collections = ['examplesuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $set: { exampleForSuggestion: false },
      })
    ));
  },

  async down(db) {
    const collections = ['examplesuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $unset: { exampleForSuggestion: false },
      })
    ));
  },
};
