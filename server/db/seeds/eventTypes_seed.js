
exports.seed = function(knex) {
  const records = [
    {type: 'PLAY'},
    {type: 'PAUSE'},
    {type: 'PLAY_ENDED'},
    {type: 'SEEK'},
    {type: 'PAGE_VIEW'}
  ]

  records.forEach((record) => {
    return knex('eventTypes').select().where(record)
      .then((res) => {
        if (res.length === 0) {
          return knex('eventTypes').insert(record)
        }
      });
  })
};
