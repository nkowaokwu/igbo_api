module.exports = {
  async up(db) {
    await db.collection('projects').insertOne({
      title: 'Igbo API',
      description: 'The largest open-source, multi-modal Igbo language dataset',
      status: 'ACTIVE',
      visibility: 'PRIVATE',
      license: 'UNSPECIFIED',
    });
  },

  async down(db) {
    await db.collection('projects').deleteOne({
      title: 'Igbo API',
    });
  },
};
