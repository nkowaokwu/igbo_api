const dialectsAsArraysPipeline = [
  {
    $match: {
      dialects: {
        $exists: true,
      },
    },
  }, {
    $set: {
      dialects: {
        $objectToArray: '$dialects',
      },
    },
  }, {
    $set: {
      dialects: {
        $function: {
          // eslint-disable-next-line
          body: 'function(dialects) {\n        return dialects.map(function ({ k, v }) {\n          v.word = k;\n          v._id = new ObjectId();\n          return v;\n        });\n      }', 
          args: [
            '$dialects',
          ],
          lang: 'js',
        },
      },
    },
  },
];

const dialectsAsObjectsPipeline = [
  {
    $match: {
      dialects: {
        $exists: true,
      },
    },
  }, {
    $set: {
      dialects: {
        $function: {
          // eslint-disable-next-line
          body: 'function(dialects) {\n        return dialects.reduce(function (finalObject, dialect) {\n          finalObject[dialect.word] = dialect;\n          return finalObject;\n        }, {});\n      }', 
          args: [
            '$dialects',
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
      const rawDocs = await db.collection(collection).aggregate(dialectsAsArraysPipeline);
      const wordDocs = await rawDocs.toArray();
      await Promise.all((wordDocs.map((wordDoc) => (
        db.collection(collection).updateOne(
          { _id: wordDoc._id },
          { $set: { dialects: wordDoc.dialects } },
        )
      ))));
    }));
    return res;
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map(async (collection) => {
      const rawDocs = await db.collection(collection).aggregate(dialectsAsObjectsPipeline);
      const wordDocs = await rawDocs.toArray();
      await Promise.all((wordDocs.map((wordDoc) => (
        db.collection(collection).updateOne(
          { _id: wordDoc._id },
          { $set: { dialects: wordDoc.dialects } },
        )
      ))));
    });
  },
};
