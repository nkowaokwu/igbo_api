const { Types } = require('../node_modules/mongoose');
module.exports = {
  async up(db) {
    const collections = ['examplesuggestions'];
    await Promise.all(
      collections.map(async (collection) => {
        db.collection(collection).updateMany({ igbo: { $exists: true }, source: 'igbo_speech' }, [
          {
            $set: {
              origin: '$source',
              translations: [],
              projectId: new Types.ObjectId('66de0ffee848d30f37403402'),
            },
          },
          {
            $unset: 'english',
          },
          {
            $unset: 'source',
          },
          {
            $set: {
              source: {
                language: 'ibo',
                text: '$igbo',
                pronunciations: '$pronunciations',
                approvals: [],
                denials: [],
                authorId: '$authorId',
              },
            },
          },
          {
            $unset: 'igbo',
          },
        ]);
      })
    );
  },

  async down() {},
};
