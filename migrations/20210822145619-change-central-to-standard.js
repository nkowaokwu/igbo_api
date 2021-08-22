module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [{
        $set: { isStandardIgbo: '$isCentralIgbo' },
      },
      {
        $unset: 'isCentralIgbo',
      }])
    ));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [{
        $set: { isCentralIgbo: '$isStandardIgbo' },
      },
      {
        $unset: 'isStandardIgbo',
      }])
    ));
  },
};
