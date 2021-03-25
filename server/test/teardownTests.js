const knexConfiguration = require("../knexfile")[process.env.NODE_ENV];
const knex = require("knex");

const setup = async () => {
  const client = knex(knexConfiguration);
  await client.migrate.rollback(true);
  await client.destroy();
};

module.exports = setup;
