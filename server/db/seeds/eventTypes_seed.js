
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('eventTypes').del()
    .then(function () {
      // Inserts seed entries
      return knex('eventTypes').insert([
        {type: 'PLAY'},
        {type: 'PAUSE'},
        {type: 'PLAY_ENDED'},
        {type: 'SEEK'},
        {type: 'PAGE_VIEW'}
      ]);
    });
};
