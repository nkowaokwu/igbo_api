const examplePronunciationsMigrationPipeline = [
  {
    $addFields: {
      pronunciations: {
        $function: {
          // eslint-disable-next-line
          body: `function(pronunciations) {
            if (!pronunciations) {
              return [];
            }
            return pronunciations.map(({ audio, speaker, _id }) => ({
              audio,
              speaker,
              // eslint-disable-next-line
              _id: _id || ObjectId(),
              review: true,
              approvals: [],
              denials: [],
            }));
          }`,
          args: ['$pronunciations'],
          lang: 'js',
        },
      },
    },
  },
];

const revertPronunciationsMigrationPipeline = [
  {
    $addFields: {
      pronunciations: {
        $map: {
          input: '$pronunciations',
          as: 'pronunciation',
          in: {
            $mergeObjects: [
              { audio: '$$pronunciation.audio' },
              { speaker: '$$pronunciation.speaker' },
              { _id: '$$pronunciation._id' },
            ],
          },
        },
      },
    },
  },
];

module.exports = {
  async up(db) {
    const collections = ['examplesuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany(
        {},
        examplePronunciationsMigrationPipeline,
      )
    ));
  },

  async down(db) {
    const collections = ['examplesuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, revertPronunciationsMigrationPipeline)
    ));
  },
};
