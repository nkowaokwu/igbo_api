module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({},
      [
        {
          $addFields: {
            frequency: {
              $cond: {
                if: {
                  $eq: ['$attributes.isCommon', true],
                },
                then: 5,
                else: 1,
              },
            },
          },
        },
      ])
    ));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $set: { frequency: 0 },
      })
    ));
  },
};
