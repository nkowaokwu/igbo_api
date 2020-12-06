module.exports = {
  async up(db) {
    return [
      db.collection('words').updateMany({}, [{
        $set: { accented: '$word' },
      }]),
      db.collection('examples').updateMany({}, [{
        $set: { accented: '$igbo' },
      }]),
    ];
  },

  async down(db) {
    return [
      db.collection('words').updateMany({}, {
        $unset: { accented: null },
      }),
      db.collection('examples').updateMany({}, {
        $unset: { accented: null },
      }),
    ];
  },
};
