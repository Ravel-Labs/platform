
exports.seed = function(knex) {
  const records = [
    {type: 'numeric', prompt: 'How would you rate this track?', scale: 10},
    {type: 'numeric', prompt: 'How likely are you to listen to this track again?', scale: 10}
  ]

  records.forEach((record) => {
    return knex('feedbackPrompts').select().where(record)
      .then((res) => {
        if (res.length === 0) {
          return knex('feedbackPrompts').insert(record)
        }
      });
  })

};
