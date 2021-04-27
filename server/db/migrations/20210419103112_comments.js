exports.up = function (knex) {
  return knex.schema.createTable("comments", (t) => {
    t.increments("id").primary();
    t.integer("userId").references("id").inTable("users");
    t.integer("trackId").references("id").inTable("tracks");
    t.timestamp("createdAt").defaultTo(knex.fn.now());
    t.text("message").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("comments");
};
