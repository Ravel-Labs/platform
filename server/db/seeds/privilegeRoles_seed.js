
exports.seed = function(knex) {
  return knex('privilegeRoles').del()
    .then(() => {
      return knex('privilegeRoles').insert([
        {roleId: 0, privilegeId: 0},
        {roleId: 0, privilegeId: 1},
        {roleId: 0, privilegeId: 2},
        {roleId: 1, privilegeId: 1},
        {roleId: 1, privilegeId: 2}
      ]);
    });
};
