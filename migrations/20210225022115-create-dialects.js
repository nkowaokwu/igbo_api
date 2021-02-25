const dialectKeys = [
  'NSA',
  'UMU',
  'ANI',
  'OKA',
  'AFI',
  'MBA',
  'EGB',
  'OHU',
  'ORL',
  'NGW',
  'OWE',
  'NSU',
  'BON',
  'OGU',
  'ONI',
  'ECH',
  'UNW',
];

const createDialects = () => (
  dialectKeys.reduce((dialectsObject, key) => ({
    ...dialectsObject,
    [key]: {
      word: '',
      variations: '',
      accented: '',
      dialect: key,
      pronunciation: '',
    },
  }), {})
);

module.exports = {
  async up(db) {
    const dialects = createDialects();
    const collections = ['words'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $set: { pronunciation: '', dialects },
      })
    ));
  },

  async down(db) {
    const collections = ['words'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, {
        $unset: { pronunciation: null, dialects: null },
      })
    ));
  },
};
