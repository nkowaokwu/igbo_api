const updatedOnConversion = [
  {
    $set: {
      updatedAt: {
        $function: {
          body: `function(updatedOn, updatedAt) {
            if (updatedOn) {
              return new Date(updatedOn).toISOString();
            }
            return updatedAt || updatedOn;
          }`,
          args: [
            '$updatedOn',
            '$updatedAt',
          ],
          lang: 'js',
        },
      },
    },
  }, {
    $unset: 'updatedOn',
  },
];

const updatedOnRevert = [
  {
    $set: {
      updatedOn: {
        $function: {
          body: 'function(updatedAt) { return new Date(updatedAt).valueOf(); }',
          args: [
            '$updatedAt',
          ],
          lang: 'js',
        },
      },
    },
  }, {
    $unset: 'updatedAt',
  },
];

module.exports = {
  async up(db) {
    const collections = ['words', 'examples', 'wordsuggestions', 'examplesuggestions', 'genericwords'];
    await Promise.all(
      collections.map(async (collection) => {
        const docs = await (await db.collection(collection).aggregate(updatedOnConversion)).toArray();
        await Promise.all(docs.map((doc) => (
          db.collection(collection).updateOne(
            // eslint-disable-next-line
            { _id: doc._id },
            {
              $set: { updatedAt: doc.updatedAt },
              $unset: { updatedOn: null },
            },
          )
        )));
      }));
  },

  async down(db) {
    const collections = ['words', 'examples', 'wordsuggestions', 'examplesuggestions', 'genericwords'];
    await Promise.all(
      collections.map(async (collection) => {
        const docs = await (await db.collection(collection).aggregate(updatedOnRevert)).toArray();
        await Promise.all(docs.map((doc) => (
          db.collection(collection).updateOne(
            // eslint-disable-next-line
            { _id: doc._id },
            {
              $set: { updatedOn: doc.updatedOn },
              $unset: { updatedAt: null },
            },
          )
        )));
      }));
  },
};
