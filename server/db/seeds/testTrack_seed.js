
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tracks').del()
    .then(() => {
      // Inserts seed entries
      return knex('tracks').insert([
        {trackName: 'My Amazing Track', genre: 'RnB', path: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'},
      ]);
    });
};
