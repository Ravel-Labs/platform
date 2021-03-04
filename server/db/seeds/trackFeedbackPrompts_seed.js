exports.seed = function (knex) {
  return knex("trackFeedbackPrompts").insert([
    { trackId: 1, promptId: 1 },
    { trackId: 1, promptId: 2 },
  ]).onConflict(['trackId', 'promptId']).ignore();
};
