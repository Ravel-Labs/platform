const config = require("../config");
const knexConfiguration = require("../knexfile")[config.nodeEnv];
const knex = require("knex");

const setup = async () => {
  const client = knex(knexConfiguration);
  await client.migrate.latest();
  await client.destroy();
};

module.exports = setup;
