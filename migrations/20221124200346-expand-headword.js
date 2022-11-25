module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [
        {
          $set: {
            wordPronunciation: '$word',
            conceptualWord: '',
          },
        },
      ])
    ));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [
        {
          $unset: ['wordPronunciation', 'conceptualWord'],
        },
      ])
    ));
  },
};
