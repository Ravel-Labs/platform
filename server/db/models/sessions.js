var db = require('../knex');

const tableName = 'sessions';

defaultReturnColumns = [
  'id',
  'trackId',
  'listenerUserId'
];

async function create(trackId, listenerUserId, fields={}) {
  try {
    const newSession = await db(tableName).insert({
      trackId,
      listenerUserId,
      ...fields
    }, defaultReturnColumns);
    console.log(newSession);
    return newSession;
  } catch(e) {
    console.error(e);
  }
}

module.exports = {
  create,
}