module.exports = {
  async up(db) {
    const collections = ['wordsuggestions', 'examplesuggestions'];
    await Promise.all(
      collections.map(async (collection) => {
        db.collection(collection).updateMany(
          {},
          {
            $unset: { crowdsourcing: null },
          }
        );
      })
    );
  },

  async down() {},
};
