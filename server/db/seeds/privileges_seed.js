
exports.seed = function(knex) {
  return knex('privileges').del()
    .then(() => {
      return knex('privileges').insert([
        {type: 'admin', description: 'ability to see admin pages and features'},
        {type: 'upload', description: 'ability to upload a song'},
        {type: 'invite', description: 'ability to invite other users to join'}
      ]);
    });
};
