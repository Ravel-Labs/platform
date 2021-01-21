var db = require('../knex');

const tableName = 'tracks';

const defaultReturnColumns = [
  'id',
  'trackName',
  'createdAt',
  'genre',
  'path',
  'slug'	
]

async function getIdBySlug(trackSlug) {
  try {
    const id = await db(tableName).where({slug:trackSlug}).select('id').first().then((row) => row['id']);
    return id;
  } catch(e) {
  	console.log(e);
  }
}

module.exports = {
	getIdBySlug,
}