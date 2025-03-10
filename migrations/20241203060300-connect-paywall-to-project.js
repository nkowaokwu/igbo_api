const getAllExamples = (projectId) => [
  {
    $match: {
      projectId,
    },
  },
];

const getAllExampleSuggestions = (projectId) => [
  {
    $match: {
      projectId,
      merged: null,
      mergedBy: null,
    },
  },
];

const getAllAudioPronunciations = (projectId) => [
  {
    $match: {
      projectId,
    },
  },
];

module.exports = {
  async up(db) {
    db.createCollection('paywalls');
    const projects = db.collection('projects').find();
    return await Promise.all(
      (await projects.toArray()).map(async (project) => {
        const examples = await db
          .collection('examples')
          .aggregate(getAllExamples(project._id))
          .toArray();
        const exampleSuggestions = await db
          .collection('examplesuggestions')
          .aggregate(getAllExampleSuggestions(project._id))
          .toArray();
        const audioPronunciations = await db
          .collection('audiopronunciations')
          .aggregate(getAllAudioPronunciations(project._id))
          .toArray();

        db.collection('paywalls').insertOne({
          projectId: project._id,
          totalExampleSuggestions: exampleSuggestions.length,
          totalExamples: examples.length,
          totalAudioPronunciations: audioPronunciations.length,
          totalBytes: audioPronunciations.reduce((totalBytes, audioPronunciation) => {
            return (
              totalBytes +
              (typeof audioPronunciation.size === 'string'
                ? parseInt(audioPronunciation.size, 10)
                : audioPronunciation.size)
            );
          }, 0),
          updatedAt: new Date(),
          createdAt: new Date(),
        });
      })
    );
  },

  async down(db) {
    return db.collection('paywalls').drop();
  },
};
