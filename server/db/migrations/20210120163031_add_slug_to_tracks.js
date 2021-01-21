
exports.up = function(knex) {
  return knex.schema.table('tracks', t => {
    t.string('slug').notNullable().defaultTo('');
	})
};

exports.down = function(knex) {
  return knex.schema.table('tracks', t => {
    t.dropColumn('slug');
	})
};
