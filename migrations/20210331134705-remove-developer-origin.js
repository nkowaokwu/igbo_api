module.exports = {
  async up(db) {
    return [
      db.collection('developers').updateMany({}, [{
        $unset: { hosts: null },
      }]),
    ];
  },

  async down(db) {
    return [
      db.collection('developers').updateMany({}, {
        $set: { hosts: '' },
      }),
    ];
  },
};
