
exports.seed = function(knex) {
  const records = [
    {trackId: 1, promptId: 1},
    {trackId: 1, promptId: 2}
  ]

  records.forEach((record) => {
    return knex('trackFeedbackPrompts').select().where(record)
      .then((res) => {
        if (res.length === 0) {
          return knex('trackFeedbackPrompts').insert(record)
        }
      });
  })
};
