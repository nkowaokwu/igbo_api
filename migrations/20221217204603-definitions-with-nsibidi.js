/* eslint-disable max-len */
const definitionsWithNsibidiMigrationPipeline = [
  {
    $set: { 'definitions.nsibidi': '$nsibidi' },
  },
  {
    $unset: 'nsibidi',
  },
];

const revertDefinitionsWithNsibidiMigrationPipeline = [
  {
    $set: { nsibidi: { $first: '$definitions.nsibidi' } },
  },
  {
    $unset: 'definitions.nsibidi',
  },
];

module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, definitionsWithNsibidiMigrationPipeline)
    ));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, revertDefinitionsWithNsibidiMigrationPipeline)
    ));
  },
};
