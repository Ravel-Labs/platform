var environment = process.env.NODE_ENV || 'development';
var config = require('../knexfile.js')[environment]
var knex = require('knex')(config);

try {
  knex('eventTypes').columnInfo().then(() => console.log("DB connected."));
} catch(e) {
  console.error(e)
}

module.exports = knex;