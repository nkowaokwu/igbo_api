const determineOwnerUserProjectPermission = (projectId) => [
  {
    $match: {
      projectId,
      role: 'admin',
    },
  },
  {
    $sort: {
      createdAt: 1,
    },
  },
  {
    $limit: 1,
  },
  {
    $addFields: {
      isOwner: true,
    },
  },
];

module.exports = {
  async up(db) {
    const projects = await db.collection('projects').find().toArray();
    await Promise.all(
      projects.map(async (project) => {
        const uRawDocs = await db
          .collection('userprojectpermissions')
          .aggregate(determineOwnerUserProjectPermission(project._id));
        const firstUserProjectPermission = (await uRawDocs.toArray())[0];
        const ownerUserProjectPermission =
          firstUserProjectPermission && firstUserProjectPermission.isOwner
            ? firstUserProjectPermission
            : { firebaseId: undefined };

        db.collection('projects').updateMany(
          {
            _id: project._id,
          },
          { $set: { ownerFirebaseId: ownerUserProjectPermission.firebaseId } }
        );
      })
    );
  },

  async down(db) {
    db.collection('userprojectpermissions').updateMany({}, [{ $unset: 'isOwner' }]);
    db.collection('projects').updateMany({}, [{ $unset: 'ownerFirebaseId' }]);
  },
};
