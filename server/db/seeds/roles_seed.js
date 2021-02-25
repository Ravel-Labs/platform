
exports.seed = function(knex) {
  return knex('roles').del()
    .then(() => {
      return knex('roles').insert([
        {name: 'admin'},
        {name: 'betaArtist'},
        {name: 'betaUser'}
      ]);
    });
};
