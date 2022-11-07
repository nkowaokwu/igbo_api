// eslint-disable-next-line
// https://stackoverflow.com/questions/70831908/mongodb-generates-same-objectid-with-new-objectid-in-pipelines-project-stage

module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [
        {
          $addFields: {
            firstDefinitions: { $first: '$definitions' },
          },
        },
        {
          $set: {
            definitions: {
              $cond: {
                if: {
                  $eq: [{ $type: '$firstDefinitions' }, 'string'],
                },
                then: [
                  {
                    wordClass: '$wordClass',
                    definitions: '$definitions',
                    _id: {
                      $function: {
                        // eslint-disable-next-line
                        body: 'function () { return new ObjectId(); }',
                        args: [],
                        lang: 'js',
                      },
                    },
                  },
                ],
                else: '$definitions',
              },
            },
          },
        },
        {
          $unset: ['wordClass', 'firstDefinitions'],
        },
      ])
    ));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [
        {
          $addFields: {
            firstDefinitions: { $first: '$definitions' },
          },
        },
        {
          $set: {
            definitions: '$firstDefinitions.definitions',
            wordClass: '$firstDefinitions.wordClass',
          },
        },
        {
          $unset: ['firstDefinitions'],
        },
      ])
    ));
  },
};
