module.exports = {
  async up(db) {
    const collections = [
      'corpus',
      'corpussuggestions',
      'examples',
      'examplesuggestions',
      'exampletranscriptionfeedbacks',
      'nsibidicharacters',
      'stats',
      'textimages',
      'words',
      'wordsuggestions',
    ];
    const igboApiProject = await db.collection('projects').findOne({ title: 'Igbo API' });

    await Promise.all(
      collections.map(async (collection) => {
        await db.collection(collection).updateMany({}, [
          {
            $addFields: {
              projectId: igboApiProject._id,
            },
          },
        ]);
      })
    );
  },

  async down(db) {
    const collections = [
      'corpus',
      'corpussuggestions',
      'examples',
      'examplesuggestions',
      'exampletranscriptionfeedbacks',
      'nsibidicharacters',
      'stats',
      'textimages',
      'words',
      'wordsuggestions',
    ];
    await Promise.all(
      collections.map(async (collection) => {
        await db.collection(collection).updateMany({}, [
          {
            $unset: 'projectId',
          },
        ]);
      })
    );
  },
};
