
exports.up = function(knex) {
  return knex.schema
    .createTable('roles', t => {
      t.increments('id').primary();
      t.string('name').unique().notNullable();
    })
    .createTable('privileges', t=> {
      t.increments('id').primary();
      t.string('type').unique().notNullable();
      t.string('description').notNullable();
    })
    .createTable('privilegeRoles', t => {
      t.increments('id').primary();
      t.integer('privilegeId').references('id').inTable('privileges').notNullable();
      t.integer('roleId').references('id').inTable('roles').notNullable();
    })
    .createTable('inviteCodes', t => {
      t.increments('id').primary();
      t.integer('userId').references('id').inTable('users').notNullable();
      t.string('code').unique().notNullable();
      t.timestamp('createdAt').defaultTo(knex.fn.now());
      t.integer('grantedRoleId').references('id').inTable('roles').notNullable();
      t.boolean('claimed').defaultTo(false).notNullable();
      t.integer('invitedUserId').references('id').inTable('users').nullable();
    })
    .table('users', t => {
      t.integer('roleId').references('id').inTable('roles').notNullable();
      t.integer('referrerId').references('id').inTable('users').nullable();
      t.integer('invitesRemaining').defaultTo(0).notNullable();
    })
    .table('tracks', t => {
      t.boolean('isPrivate').defaultTo(false).notNullable();
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('roles')
    .dropTable('privileges')
    .dropTable('privilegeRoles')
    .dropTable('inviteCodes')
    .table('users', t => {
      t.dropColumn('roleId');
      t.dropColumn('referrerId');
      t.dropColumn('invitesRemaining');
    })
    .table('tracks', t => {
      t.dropColumn('isPrivate');
    })
};