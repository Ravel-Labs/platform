exports.up = function (knex) {
  return knex.schema.table("tracks", (t) => {
    t.text("description").defaultTo("");
    t.renameColumn("trackName", "title");
  });
};

exports.down = function (knex) {
  return knex.schema.table("tracks", (t) => {
    t.dropColumn("description");
    t.renameColumn("title", "trackName");
  });
};
