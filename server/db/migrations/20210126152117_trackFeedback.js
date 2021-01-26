
exports.up = function(knex) {
  return knex.schema
  	.createTable('trackFeedbackPrompts', t => {
  		t.increments('id').primary();
  		t.integer('trackId').references('id').inTable('tracks');
  		t.integer('promptId').references('id').inTable('feedbackPrompts');
  	})
  	.table('feedback', t => {
  		t.integer('promptId').references('id').inTable('feedbackPrompts');
  	})
};

exports.down = function(knex) {
  return knex.schema
  	.dropTable('trackFeedbackPrompts')
  	.table('feedback', t => t.dropColumn('promptId'))
};
