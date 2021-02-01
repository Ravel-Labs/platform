
// exports.seed = function(knex) {
//   const records = [
//     {type: 'PLAY'},
//     {type: 'PAUSE'},
//     {type: 'PLAY_ENDED'},
//     {type: 'SEEK'},
//     {type: 'PAGE_VIEW'}
//   ]
//   return knex('eventTypes').del().then(() => {
//     records.forEach((record) => {
//       return knex('eventTypes').select().where(record)
//         .then((res) => {
//           if (res.length === 0) {
//             return knex('eventTypes').insert(record)
//           }
//         });
//     }) 
//   })
// };

exports.seed = function(knex) {
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
