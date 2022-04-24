module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map(async (collection) => {
      db.collection(collection).updateMany({}, [
        {
          $set: {
            attributes: {
              isStandardIgbo: '$isStandardIgbo',
              isAccented: '$isAccented',
              isComplete: '$isComplete',
              isSlang: false,
              isConstructedTerm: false,
            },
          },
        },
        {
          $unset: ['isStandardIgbo', 'isAccented', 'isComplete'],
        },
      ]);
    });
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map(async (collection) => {
      db.collection(collection).updateMany({}, [
        {
          $set: {
            isStandardIgbo: '$attributes.isStandardIgbo',
            isAccented: '$attributes.isAccented',
            isComplete: '$attributes.isComplete',
          },
        },
        {
          $unset: ['attributes'],
        },
      ]);
    });
  },
};
