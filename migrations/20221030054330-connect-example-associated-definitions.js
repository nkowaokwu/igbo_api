const associatedDefinitionsSchemasMigrationPipeline = [
  {
    $match: {
      'associatedWords.0': {
        $exists: true,
      },
    },
  }, {
    $lookup: {
      from: 'words',
      localField: 'associatedWords.0',
      foreignField: '_id',
      as: 'words',
    },
  }, {
    $addFields: {
      definition: {
        $first: '$words.definitions',
      },
    },
  }, {
    $addFields: {
      associatedDefinitionsSchemas: [
        {
          $first: '$definition._id',
        },
      ],
    },
  }, {
    $unset: ['definition'],
  },
];

module.exports = {
  async up(db) {
    const collections = ['examples', 'examplesuggestions'];
    const res = await Promise.all(collections.map(async (collection) => {
      const rawDocs = await db.collection(collection).aggregate(associatedDefinitionsSchemasMigrationPipeline);
      const exampleDocs = await rawDocs.toArray();
      await Promise.all((exampleDocs.map((exampleDoc) => (
        db.collection(collection).updateOne(
          { _id: exampleDoc._id },
          { $set: { associatedDefinitionsSchemas: exampleDoc.associatedDefinitionsSchemas } },
        )
      ))));
    }));
    return res;
  },

  async down(db) {
    const collections = ['examples', 'examplesuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $unset: { associatedDefinitionsSchemas: null },
      })
    ));
  },
};
