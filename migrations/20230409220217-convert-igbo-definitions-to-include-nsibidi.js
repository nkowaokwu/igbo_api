const igboDefinitionsToIncludeNsibidiPipeline = [
  {
    $match: {
      'definitions.igboDefinitions.0': {
        $exists: true,
      },
    },
  },
  {
    $addFields: {
      'definitions.igboDefinitions': {
        $map: {
          input: '$definitions.igboDefinitions',
          as: 'igboDefinition',
          in: {
            igbo: {
              $first: '$$igboDefinition',
            },
            nsibidi: '',
          },
        },
      },
    },
  },
];

const revertIgboDefinitionsToIncludeNsibidiPipeline = [
  {
    $match: {
      'definitions.igboDefinitions.0': {
        $exists: true,
      },
    },
  },
  {
    $addFields: {
      'definitions.igboDefinitions': {
        $map: {
          input: '$definitions.igboDefinitions',
          as: 'igboDefinition',
          in: {
            $first: '$$igboDefinition',
          },
        },
      },
    },
  },
  {
    $addFields: {
      'definitions.igboDefinitions': {
        $map: {
          input: '$definitions.igboDefinitions',
          as: 'igboDefinition',
          in: {
            $first: '$$igboDefinition.igbo',
          },
        },
      },
    },
  },
];

module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    return Promise.all(collections.map(async (collection) => {
      const rawDocs = await db.collection(collection).aggregate(igboDefinitionsToIncludeNsibidiPipeline);
      const wordDocs = await rawDocs.toArray();
      await Promise.all((wordDocs.map((wordDoc) => (
        db.collection(collection).updateOne(
          { _id: wordDoc._id },
          { $set: { definitions: wordDoc.definitions } },
        )
      ))));
    }));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    return Promise.all(collections.map(async (collection) => {
      const rawDocs = await db.collection(collection).aggregate(revertIgboDefinitionsToIncludeNsibidiPipeline);
      const wordDocs = await rawDocs.toArray();
      await Promise.all((wordDocs.map((wordDoc) => (
        db.collection(collection).updateOne(
          { _id: wordDoc._id },
          { $set: { definitions: wordDoc.definitions } },
        )
      ))));
    }));
  },
};
