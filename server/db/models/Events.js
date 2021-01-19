var db = require('../knex');

const tableName = 'events';
const typeTableName = 'eventTypes';

const defaultReturnColumns = [
  'id',
  'trackId',
  'eventType',
  'listenerUserId',
  'eventData',
  'createdAt'	
]

async function getEventId(event) {
  try {
    const eventId = await db(typeTableName).where({type: event}).select('id').first().then((row) => row['id']);
    console.log(eventId);
    return eventId
  } catch(e) {
    console.log(e);
  } 
}

async function create(trackId, eventType, listenerUserId, eventData, fields={}) {
  try {
    // const eventType = await getEventId(event);
    
    const newEvent = await db(tableName).insert({
      trackId,
      eventType,
      eventData,
      ...fields,
    }, defaultReturnColumns);
    console.log(newEvent)
    return newEvent;
  } catch(e) {
    console.log(e);
  }
}

module.exports = {
  create,
  getEventId,
}