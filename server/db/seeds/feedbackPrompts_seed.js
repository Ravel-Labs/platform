
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('feedbackPrompts').del()
    .then(() => {
      // Inserts seed entries
      return knex('feedbackPrompts').insert([
        {type: 'numeric', prompt: 'How would you rate this track?', scale: 10},
        {type: 'numeric', prompt: 'How likely are you to listen to this track again?', scale: 10}
      ]);
    });
};
