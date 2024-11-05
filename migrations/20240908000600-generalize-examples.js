const examplesMigrationPipeline = [
  {
    $addFields: {
      source: {
        language: 'ibo',
        text: '$igbo',
      },
      translations: [
        {
          language: 'eng',
          text: '$english',
        },
      ],
    },
  },
  {
    $unset: 'igbo',
  },
  {
    $unset: 'english',
  },
];

const examplesRevertPipeline = [
  {
    $addFields: {
      igbo: '$source.text',
      english: '$translations.0.text',
    },
  },
  {
    $unset: 'source',
  },
  {
    $unset: 'translations',
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
