const medialToActivePipeline = [
  {
    $match: {
      $or: [
        { 'definitions.0.wordClass': 'AV' },
        { 'definitions.0.wordClass': 'PV' },
        { 'definitions.0.wordClass': 'MV' },
      ],
    },
  },
];

const revertMedialToActivePipeline = [
  {
    $match: {
      $or: [
        { 'definitions.0.wordClass': 'AV' },
        { 'definitions.0.wordClass': 'PV' },
        { 'definitions.0.wordClass': 'MV' },
      ],
    },
  },
];

module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    return Promise.all(collections.map(async (collection) => {
      const rawDocs = await db.collection(collection).aggregate(medialToActivePipeline);
      const wordDocs = await rawDocs.toArray();
      await Promise.all((wordDocs.map((wordDoc) => (
        db.collection(collection).updateOne(
          { _id: wordDoc._id },
          { $set: { 'tenses.presentPassive': '' } },
        )
      ))));
    }));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    return Promise.all(collections.map(async (collection) => {
      const rawDocs = await db.collection(collection).aggregate(revertMedialToActivePipeline);
      const wordDocs = await rawDocs.toArray();
      await Promise.all((wordDocs.map((wordDoc) => (
        db.collection(collection).updateOne(
          { _id: wordDoc._id },
          { $unset: { 'tenses.presentPassive': null } },
        )
      ))));
    }));
  },
};
