const { Types } = require('mongoose');

module.exports = {
  async up(db) {
    await db.collection('projects').insertOne({
      _id: new Types.ObjectId('66de0ffee848d30f37403402'),
      title: 'Igbo API',
      description: 'The largest open-source, multi-modal Igbo language dataset',
      status: 'ACTIVE',
      visibility: 'PRIVATE',
      license: 'UNSPECIFIED',
      languages: [],
    });
  },

  async down(db) {
    await db.collection('projects').deleteOne({
      title: 'Igbo API',
    });
  },
};
