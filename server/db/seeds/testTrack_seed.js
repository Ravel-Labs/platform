
// exports.seed = function(knex) {
//   const records = [
//     {trackName: 'My Amazing Track', genre: 'RnB', path: 'https://ravel-platform-dev.s3.us-west-1.amazonaws.com/track-uploads/test_track-1611689045558.mpga', slug: 'testSlug'},
//   ]

//   records.forEach((record) => {
//     return knex('tracks').select().where(record)
//       .then((res) => {
//         if (res.length === 0) {
//           return knex('tracks').insert(record)
//         }
//       });
//   })
// };

exports.seed = function(knex) {
  return knex('tracks').del()
    .then(() => {
      // Inserts seed entries
      return knex('tracks').insert([
        {trackName: 'My Amazing Track', genre: 'RnB', path: 'https://ravel-platform-dev.s3.us-west-1.amazonaws.com/track-uploads/test_track-1611689045558.mpga', slug: 'testSlug'},
      ]);
    });
};