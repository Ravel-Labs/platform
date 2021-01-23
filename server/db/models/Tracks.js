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

async function create(trackName, genre, path, slug, fields={}) {
  try {
    track = await db(tableName).insert({
      trackName,
      genre,
      path,
      slug,
      ...fields,
    }, defaultReturnColumns);
    console.log(track);
    return track;
  } catch(e) {
    console.error(e);
  }
}

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
  create,
}