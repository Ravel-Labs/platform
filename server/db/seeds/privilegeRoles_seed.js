exports.seed = function(knex) {
  return knex('privilegeRoles').del()
    .then(() => {
      return knex('roles').del();
    })
    .then(() => {
      return knex('privileges').del();
    })
    .then(() => {
      return knex('roles').insert([
        {id: 0, name: 'admin'},
        {id: 1, name: 'betaArtist'},
        {id: 2, name: 'betaUser'}
      ]).onConflict('name').ignore();;
    })
    .then(() => {
      return knex('privileges').insert([
        {id: 0, type: 'admin', description: 'ability to see admin pages and features'},
        {id: 1, type: 'upload', description: 'ability to upload a song'},
        {id: 2, type: 'invite', description: 'ability to invite other users to join'}
      ]).onConflict('type').ignore();
    })
    .then(() => {
      return knex('privilegeRoles').insert([
        {id: 0, roleId: 0, privilegeId: 0},
        {id: 1, roleId: 0, privilegeId: 1},
        {id: 2, roleId: 0, privilegeId: 2},
        {id: 3, roleId: 1, privilegeId: 1},
        {id: 4, roleId: 1, privilegeId: 2}
      ]).onConflict(['roleId', 'privilegeId']).ignore();
    });
}
// .onConflict(['roleId', 'privilegeId']).ignore()
// exports.seed = function(knex) {
//   return knex('privileges').del()
//     .then(() => {
//       return knex('privileges').insert([
//         {type: 'admin', description: 'ability to see admin pages and features'},
//         {type: 'upload', description: 'ability to upload a song'},
//         {type: 'invite', description: 'ability to invite other users to join'}
//       ]);
//     });
// };

// exports.seed = function(knex) {
//   return knex('roles').del()
//     .then(() => {
//       return knex('roles').insert([
//         {name: 'admin'},
//         {name: 'betaArtist'},
//         {name: 'betaUser'}
//       ]);
//     });
// };

// exports.seed = function(knex) {
//   return knex('privilegeRoles').del()
//     .then(() => {
//       return knex('privilegeRoles').insert([
//         {roleId: 0, privilegeId: 0},
//         {roleId: 0, privilegeId: 1},
//         {roleId: 0, privilegeId: 2},
//         {roleId: 1, privilegeId: 1},
//         {roleId: 1, privilegeId: 2}
//       ]);
//     });
// };
