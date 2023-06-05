const trimPipeline = [
  {
    $project: {
      word: {
        $trim: {
          input: '$word',
        },
      },
      wordPronunciation: 1,
      conceptualWord: 1,
      definitions: 1,
      dialects: 1,
      tags: 1,
      'tenses.infinitive': {
        $trim: {
          input: '$tenses.infinitive',
        },
      },
      'tenses.imperative': {
        $trim: {
          input: '$tenses.imperative',
        },
      },
      'tenses.simplePast': {
        $trim: {
          input: '$tenses.simplePast',
        },
      },
      'tenses.presentPassive': {
        $trim: {
          input: '$tenses.presentPassive',
        },
      },
      'tenses.simplePresent': {
        $trim: {
          input: '$tenses.simplePresent',
        },
      },
      'tenses.presentContinuous': {
        $trim: {
          input: '$tenses.presentContinuous',
        },
      },
      'tenses.future': {
        $trim: {
          input: '$tenses.future',
        },
      },
      attributes: 1,
      pronunciation: 1,
      variations: 1,
      frequency: 1,
      relatedTerms: 1,
      hypernyms: 1,
      hyponyms: 1,
      stems: 1,
      __v: 1,
      updatedAt: 1,
      createdAt: 1,
    },
  },
];

const revertTrimPipeline = [
  {
    $project: {
      word: 1,
      wordPronunciation: 1,
      conceptualWord: 1,
      definitions: 1,
      dialects: 1,
      tags: 1,
      tenses: 1,
      attributes: 1,
      pronunciation: 1,
      variations: 1,
      frequency: 1,
      relatedTerms: 1,
      hypernyms: 1,
      hyponyms: 1,
      stems: 1,
      __v: 1,
      updatedAt: 1,
      createdAt: 1,
    },
  },
];

module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    await Promise.all(collections.map((collection) => (
      db.collection(collection).updateMany({}, trimPipeline)
    )));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    await Promise.all(collections.map((collection) => (
      db.collection(collection).updateMany({}, revertTrimPipeline)
    )));
  },
};
