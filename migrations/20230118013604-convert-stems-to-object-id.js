const stemsToObjectIdMigrationPipeline = [
  {
    $match: {
      'stems.0': {
        $exists: true,
        $type: 'string',
      },
    },
  }, {
    $addFields: {
      stems: {
        $map: {
          input: '$stems',
          in: {
            $cond: {
              if: { $gte: [{ $strLenCP: '$$this' }, 24] },
              then: { $toObjectId: '$$this' },
              else: '$$this',
            },
          },
        },
      },
    },
  },
];

const revertStemsToObjectIdMigrationPipeline = [
  {
    $match: {
      'stems.0': {
        $exists: true,
      },
    },
  }, {
    $addFields: {
      stems: {
        $map: {
          input: '$stems',
          in: { $toString: '$$this' },
        },
      },
    },
  },
];

module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    return Promise.all(collections.map(async (collection) => {
      const rawDocs = await db.collection(collection).aggregate(stemsToObjectIdMigrationPipeline);
      const wordDocs = await rawDocs.toArray();
      await Promise.all((wordDocs.map((wordDoc) => (
        db.collection(collection).updateOne(
          { _id: wordDoc._id },
          { $set: { stems: wordDoc.stems } },
        )
      ))));
    }));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    return Promise.all(collections.map(async (collection) => {
      const rawDocs = await db.collection(collection).aggregate(revertStemsToObjectIdMigrationPipeline);
      const wordDocs = await rawDocs.toArray();
      await Promise.all((wordDocs.map((wordDoc) => (
        db.collection(collection).updateOne(
          { _id: wordDoc._id },
          { $set: { stems: wordDoc.stems } },
        )
      ))));
    }));
  },
};
