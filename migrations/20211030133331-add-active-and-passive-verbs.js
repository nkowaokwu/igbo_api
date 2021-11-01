module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggetions', 'genericwords'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [{
        $set: {
          wordClass: {
            $cond: {
              if: { $eq: ['$wordClass', 'V'] },
              then: 'AV',
              else: '$wordClass',
            },
          },
        },
      }])
    ));
  },

  async down(db) {
    const collections = ['words', 'wordsuggetions', 'genericwords'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [{
        $set: {
          wordClass: {
            $cond: {
              if: { $eq: ['$wordClass', 'AV'] },
              then: 'V',
              else: '$wordClass',
            },
          },
        },
      }])
    ));
  },
};
