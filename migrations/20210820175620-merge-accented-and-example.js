module.exports = {
  async up(db) {
    const collections = ['examples', 'exampleSuggestions'];
    const igboAccentedMigration = {
      igbo: {
        $cond: {
          if: {
            $and: [
              { $ne: ['$accented', ''] },
              { $ne: ['$accented', null] },
              { $ne: ['$accented', undefined] },
            ],
          },
          then: '$accented',
          else: '$igbo',
        },
      },
    };

    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [{
        $set: {
          ...igboAccentedMigration,
        },
      },
      {
        $unset: ['accented'],
      }])
    ));
  },

  async down(db) {
    const collections = ['examples', 'exampleSuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [{
        $set: { igbo: '$igbo', accented: '$igbo' },
      }])
    ));
  },
};
