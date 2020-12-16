module.exports = {
  async up(db) {
    const collections = ['wordsuggestions', 'examplesuggestions', 'genericwords'];
    return collections.map((collection) => (
      collection !== 'genericwords' ? (
        db.collection(collection).updateMany({}, {
          $set: { authorId: '' },
          $unset: { userEmail: null },
        })
      ) : (
        db.collection(collection).updateMany({}, {
          $unset: { userEmail: null },
        })
      )
    ));
  },

  async down(db) {
    const collections = ['wordsuggestions', 'examplesuggestions', 'genericwords'];
    return collections.map((collection) => (
      collection !== 'genericwords' ? (
        db.collection(collection).updateMany({}, {
          $unset: { authorId: null },
          $set: { userEmail: '' },
        })
      ) : (
        db.collection(collection).updateMany({}, {
          $set: { userEmail: '' },
        })
      )
    ));
  },
};
