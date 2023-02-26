const pronunciationsMigrationPipeline = [
  {
    $set: {
      pronunciations: [{
        audio: '$pronunciation',
        speaker: '',
      }],
    },
  },
  {
    $unset: 'pronunciation',
  },
];
const revertPronunciationsMigrationPipeline = [
  {
    $set: {
      pronunciation: '$pronunciations.0.audio',
    },
  },
  {
    $unset: 'pronunciations',
  },
];

module.exports = {
  async up(db) {
    const collections = ['examples', 'examplesuggestions'];
    return collections.map(async (collection) => {
      db.collection(collection).updateMany({}, pronunciationsMigrationPipeline);
    });
  },

  async down(db) {
    const collections = ['examples', 'examplesuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, revertPronunciationsMigrationPipeline)
    ));
  },
};
