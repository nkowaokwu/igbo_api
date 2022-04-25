module.exports = {
  async up(db) {
    const collections = ['examples', 'examplesuggestions'];
    return collections.map(async (collection) => {
      db.collection(collection).updateMany({}, [
        {
          $set: {
            meaning: '',
            style: '',
          },
        },
      ]);
    });
  },

  async down(db) {
    const collections = ['examples', 'examplesuggestions'];
    return collections.map(async (collection) => {
      db.collection(collection).updateMany({}, [
        {
          $unset: ['meaning', 'style'],
        },
      ]);
    });
  },
};
