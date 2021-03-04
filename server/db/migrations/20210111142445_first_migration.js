exports.up = function(knex) {
  return knex.schema
  	.createTable('users', t => {
  		t.increments('id').primary();
  		t.string('name').notNullable().defaultTo('');
  		t.string('username').unique().notNullable();
  		t.string('email').unique().notNullable();
  		t.string('passwordHash').notNullable();
  		t.string('displayName').unique().notNullable().defaultTo('');
  		t.timestamp('createdAt').defaultTo(knex.fn.now());

  	})
  	.createTable('tracks', t => {
  		t.increments('id').primary();
  		t.string('trackName').notNullable();
  		t.timestamp('createdAt').defaultTo(knex.fn.now());
  		t.string('genre').notNullable();
  		t.string('path').unique().notNullable();
  	})
  	.createTable('trackCredits', t => {
  		t.increments('id').primary();
  		t.integer('trackId').references('id').inTable('tracks');
  		t.integer('userId').references('id').inTable('users');
  	})
  	.createTable('eventTypes', t => {
  		t.increments('id').primary();
  		t.string('type').unique().notNullable();
  	})
  	.createTable('events', t => {
  		t.increments('id').primary();
  		t.integer('trackId').references('id').inTable('tracks');
  		t.integer('eventType').references('id').inTable('eventTypes');
  		t.integer('listenerUserId').references('id').inTable('users').nullable();
  		t.jsonb('eventData').notNullable();
  	})
  	.createTable('feedbackPrompts', t => {
  		t.increments('id').primary();
  		t.string('type').notNullable();
  		t.string('prompt').notNullable();
  		t.integer('scale').notNullable();
  	})
  	.createTable('feedback', t => {
  		t.increments('id').primary();
  		t.integer('trackId').references('id').inTable('tracks');
  		t.integer('listenerUserId').references('id').inTable('users').nullable();
  		t.integer('value').notNullable();
  		t.timestamp('createdAt').defaultTo(knex.fn.now());
  	})
};

exports.down = function(knex) {
	// NOTE: order matters here to ensure we can run this backward without error.
  return knex.schema
		.dropTable('trackCredits')
  	.dropTable('events')
  	.dropTable('eventTypes')
  	.dropTable('feedback')
  	.dropTable('tracks')
  	.dropTable('users')
  	.dropTable('feedbackPrompts')
};
