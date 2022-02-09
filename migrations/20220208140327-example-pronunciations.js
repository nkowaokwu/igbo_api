module.exports = {
  async up(db) {
    const collections = ['examples', 'examplesuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $set: { pronunciation: '' },
      })
    ));
  },

  async down(db) {
    const collections = ['examples', 'examplesuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $unset: { pronunciation: null },
      })
    ));
  },
};
