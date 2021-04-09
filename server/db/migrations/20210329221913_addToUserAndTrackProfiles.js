exports.up = function (knex) {
  return knex.schema
    .table("tracks", (t) => {
      t.string("imagePath").nullable();
    })
    .table("users", (t) => {
      t.string("imagePath").nullable();
      t.text("bio").notNullable().defaultTo("");
      t.string("city").notNullable().defaultTo("");
      t.string("country").notNullable().defaultTo("");
    })
    .createTable("links", (t) => {
      t.increments("id").primary();
      t.string("url").notNullable();
      t.string("type").notNullable();
      t.integer("userId").references("id").inTable("users").notNullable();
      t.unique(["url", "userId"]);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("links")
    .table("users", (t) => {
      t.dropColumn("imagePath");
      t.dropColumn("bio");
      t.dropColumn("city");
      t.dropColumn("country");
    })
    .table("tracks", (t) => {
      t.dropColumn("imagePath");
    });
};
