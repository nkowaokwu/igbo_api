module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions', 'genericwords'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $set: {
          synonyms: [],
          antonyms: [],
          hypernyms: [],
          hyponyms: [],
        },
      })
    ));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions', 'genericwords'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $unset: {
          synonyms: null,
          antonyms: null,
          hypernyms: null,
          hyponyms: null,
        },
      })
    ));
  },
};
