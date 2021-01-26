
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('trackFeedbackPrompts').del()
    .then(() => {
      // Inserts seed entries
      return knex('trackFeedbackPrompts').insert([
        {trackId: 1, promptId: 1},
        {trackId: 1, promptId: 2}
      ]);
    });
};
