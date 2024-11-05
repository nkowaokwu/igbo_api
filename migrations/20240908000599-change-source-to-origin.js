const examplesMigrationPipeline = [
  {
    $addFields: {
      origin: '$source',
    },
  },
  {
    $unset: 'source',
  },
];

const examplesRevertPipeline = [
  {
    $addFields: {
      source: '$origin',
    },
  },
  {
    $unset: 'origin',
  },
];

module.exports = {
  async up(db) {
    const collections = ['examples', 'examplesuggestions'];
    await Promise.all(
      collections.map(async (collection) => {
        await db.collection(collection).updateMany({}, examplesMigrationPipeline);
      })
    );
  },

  async down(db) {
    const collections = ['examples', 'examplesuggestions'];
    await Promise.all(
      collections.map(async (collection) => {
        await db.collection(collection).updateMany({}, examplesRevertPipeline);
      })
    );
  },
};
