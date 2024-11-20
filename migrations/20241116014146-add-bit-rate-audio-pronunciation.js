module.exports = {
  async up(db) {
    const collections = ['audiopronunciations'];
    return collections.map((collection) =>
      db.collection(collection).updateMany({}, [
        {
          $addFields: { bitRate: 30000 },
        },
      ])
    );
  },

  async down(db) {
    const collections = ['audiopronunciations'];
    return collections.map((collection) =>
      db.collection(collection).updateMany({}, [
        {
          $unset: 'bitRate',
        },
      ])
    );
  },
};
