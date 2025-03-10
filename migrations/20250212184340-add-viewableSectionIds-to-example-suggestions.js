module.exports = {
  async up(db) {
    const collections = ['examplesuggestions'];
    await Promise.all(
      collections.map(async (collection) => {
        db.collection(collection).updateMany(
          {},
          {
            $set: { viewableSectionIds: [] },
          }
        );
      })
    );
  },

  async down() {},
};
