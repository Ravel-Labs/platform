exports.up = function(knex) {
  return knex.schema.table('events', t => {
    t.timestamp('createdAt').defaultTo(knex.fn.now());
  }) 
};

exports.down = function(knex) {
  return knex.schema.table('events', t=> {
    t.dropColumn('createdAt');
  }) 
};

