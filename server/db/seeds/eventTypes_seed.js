exports.seed = function (knex) {
  return knex("eventTypes")
    .insert([
      { type: "PLAY" },
      { type: "PAUSE" },
      { type: "PLAY_ENDED" },
      { type: "SEEK" },
      { type: "PAGE_VIEW" },
    ])
    .onConflict("type")
    .ignore();
};
