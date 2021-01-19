var db = require('../knex');

const tableName = 'events';

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
    const eventId = await db(tableName).where(type: event).select('id');
    console.log(eventId);
    return eventId
  } catch(e) {
    console.log(e);
  } 
}

async function create(trackId, eventType, listenerUserId, eventData, fields={}) {
  try {
    const eventId = await getEventId(eventType);
    const newEvent = await db(tableName).insert({
      trackId,
      eventId,
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
  create
}