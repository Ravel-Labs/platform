exports.up = function (knex) {
  return knex.schema
    .createTable("sessions", (t) => {
      t.increments("id").primary();
      t.integer("trackId").references("id").inTable("tracks");
      t.integer("listenerUserId").references("id").inTable("users").nullable();
    })
    .table("events", (t) => {
      t.dropColumn("listenerUserId");
      t.integer("sessionId").references("id").inTable("sessions");
    });
};

exports.down = function (knex) {
  return knex.schema
    .table("events", (t) => {
      t.integer("listenerUserId").references("id").inTable("users").nullable();
      t.dropColumn("sessionId");
    })
    .dropTable("sessions");
};
