
exports.up = function(knex) {
  return knex.schema
  	.createTable('users', t => {
  		t.increments('id').primary();
  		t.string('name', 255).notNullable();
  		t.string('username', 255).unique().notNullable();
  		t.string('email', 255).unique().notNullable();
  		t.string('passwordHash').notNullable();
  		t.string('displayName').unique().notNullable();
  		t.timestamp('createdAt').defaultTo(knex.fn.now())

  	})
  	.createTable('tracks', t => {
  		t.increments('id').primary();
  		t.string('trackName', 255).notNullable();
  		t.timestamp('createdAt').defaultTo(knex.fn.now());
  		t.string('genre', 255).notNullable();
  		t.string('path', 255).unique().notNullable()
  	})
  	.createTable('trackCredits', t => {
  		t.increments('id').primary();
  		t.integer('trackId').references('id').inTable('tracks');
  		t.integer('userId').references('id').inTable('users');
  	})
  	.createTable('eventTypes', t => {
  		t.increments('id').primary();
  		t.string('type', 255).unique().notNullable();
  	})
  	.createTable('events', t=> {
  		t.increments('id').primary();
  		t.integer('trackId').references('id').inTable('tracks');
  		t.integer('eventType').references('id').inTable('eventTypes');
  		t.integer('listenerUserId').references('id').inTable('users');
  		t.jsonb('eventData').notNullable();
  	})
};

exports.down = function(knex) {
  return knex.schema
  	.dropTable('users')
  	.dropTable('tracks')
  	.dropTable('trackCredits')
  	.dropTable('eventTypes')
  	.dropTable('events')
};
