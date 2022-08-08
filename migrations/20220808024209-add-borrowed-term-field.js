module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map(async (collection) => {
      db.collection(collection).updateMany({}, [
        {
          $set: {
            attributes: {
              isStandardIgbo: '$attributes.isStandardIgbo',
              isAccented: '$attributes.isAccented',
              isComplete: '$attributes.isComplete',
              isSlang: '$attributes.isSlang',
              isConstructedTerm: '$attributes.isConstructedTerm',
              isBorrowedTerm: false,
            },
          },
        },
      ]);
    });
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map(async (collection) => {
      db.collection(collection).updateMany({}, [
        {
          $unset: 'attributes.isBorrowedTerm',
        },
      ]);
    });
  },
};
