module.exports = {
  async up(db) {
    const collections = ['projects'];
    return collections.map((collection) =>
      db.collection(collection).updateMany(
        {},
        {
          $set: { types: ['TEXT_AUDIO_ANNOTATION'] },
        }
      )
    );
  },

  async down(db) {
    const collections = ['projects'];
    return collections.map((collection) =>
      db.collection(collection).updateMany(
        {},
        {
          $unset: { types: null },
        }
      )
    );
  },
};
