const pronunciationsMigrationPipeline = [
  {
    $set: {
      pronunciations: [{
        audio: '$pronunciation',
        speaker: '',
      }],
    },
  },
  { $unset: 'pronunciation' },
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
      db.collection(collection).updateMany(
        { $and: [{ pronunciation: { $ne: '' } }, { pronunciation: { $ne: null } }] },
        pronunciationsMigrationPipeline,
      );
      db.collection(collection).updateMany(
        { pronunciations: { $exists: false } },
        [{ $set: { pronunciations: [] } }, { $unset: 'pronunciation' }],
      );
    });
  },

  async down(db) {
    const collections = ['examples', 'examplesuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, revertPronunciationsMigrationPipeline)
    ));
  },
};
