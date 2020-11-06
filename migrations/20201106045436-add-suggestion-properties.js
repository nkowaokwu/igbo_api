module.exports = {
  async up(db) {
    const collections = ['wordsuggestions', 'examplesuggestions', 'genericwords'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $set: { userComments: '', userEmail: '' },
        $rename: { details: 'editorsNotes' },
      })
    ));
  },

  async down(db) {
    const collections = ['wordsuggestions', 'examplesuggestions', 'genericwords'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $unset: { userComments: '', userEmail: '' },
        $rename: { editorsNotes: 'details' },
      })
    ));
  },
};
