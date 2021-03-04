exports.seed = function(knex) {
  return knex('feedbackPrompts').insert([
    {id: 1, type: 'numeric', prompt: 'How would you rate this track?', scale: 10},
    {id: 2, type: 'numeric', prompt: 'How likely are you to listen to this track again?', scale: 10}
  ]).onConflict("id").ignore();
};