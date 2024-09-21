const addPronunciationsToSourceAndTranslationsPipeline = [
  {
    $addFields: {
      'source.pronunciations': '$pronunciations',
    },
  },
  {
    $addFields: {
      translations: {
        $map: {
          input: '$translations',
          as: 'translation',
          in: {
            $mergeObjects: [
              '$$translation',
              {
                pronunciations: [],
              },
            ],
          },
        },
      },
    },
  },
  {
    $unset: 'pronunciations',
  },
];

const addPronunciationsToSourceAndTranslationsRevertPipeline = [
  {
    $addFields: {
      pronunciations: '$source.pronunciations',
    },
  },
  {
    $unset: '$source.pronunciations',
  },
  {
    $unset: '$translations.pronunciation',
  },
];

module.exports = {
  async up(db) {
    const collections = ['examples', 'examplesuggestions'];
    await Promise.all(
      collections.map(async (collection) => {
        await db
          .collection(collection)
          .updateMany({}, addPronunciationsToSourceAndTranslationsPipeline);
      })
    );
  },

  async down(db) {
    const collections = ['examples', 'examplesuggestions'];
    await Promise.all(
      collections.map(async (collection) => {
        await db
          .collection(collection)
          .updateMany({}, addPronunciationsToSourceAndTranslationsRevertPipeline);
      })
    );
  },
};
