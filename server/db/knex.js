const config = require("../config");
var environment = config.nodeEnv || "development";
var knexConfig = require("../knexfile.js")[environment];
var knex = require("knex")(knexConfig);

module.exports = knex;
