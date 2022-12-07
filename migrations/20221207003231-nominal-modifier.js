/* eslint-disable max-len */
const nominalModifierMigrationPipeline = [
  {
    $match: {
      'definitions.wordClass': 'ADJ',
    },
  }, {
    $set: {
      definitions: {
        $function: {
          body: 'function (definitions) { const updatedDefinitions = definitions.map((definition) => { if (definition.wordClass === \'ADJ\') { definition.wordClass = \'ND\' } return definition }) ; return updatedDefinitions; }',
          args: [
            '$definitions',
          ],
          lang: 'js',
        },
      },
    },
  },
];

const revertNominalModifierMigrationPipeline = [
  {
    $match: {
      'definitions.wordClass': 'ND',
    },
  }, {
    $set: {
      definitions: {
        $function: {
          body: 'function (definitions) { const updatedDefinitions = definitions.map((definition) => { if (definition.wordClass === \'ND\') { definition.wordClass = \'ADJ\' } return definition }) ; return updatedDefinitions; }',
          args: [
            '$definitions',
          ],
          lang: 'js',
        },
      },
    },
  },
];

module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    const res = await Promise.all(collections.map(async (collection) => {
      const rawDocs = await db.collection(collection).aggregate(nominalModifierMigrationPipeline);
      const wordDocs = await rawDocs.toArray();
      await Promise.all((wordDocs.map((wordDoc) => (
        db.collection(collection).updateOne(
          { _id: wordDoc._id },
          { $set: { definitions: wordDoc.definitions } },
        )
      ))));
    }));
    return res;
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    const res = await Promise.all(collections.map(async (collection) => {
      const rawDocs = await db.collection(collection).aggregate(revertNominalModifierMigrationPipeline);
      const wordDocs = await rawDocs.toArray();
      await Promise.all((wordDocs.map((wordDoc) => (
        db.collection(collection).updateOne(
          { _id: wordDoc._id },
          { $set: { definitions: wordDoc.definitions } },
        )
      ))));
    }));
    return res;
  },
};
