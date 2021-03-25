const dotenv = require("dotenv");
dotenv.config();
const knexConfiguration = require("../knexfile")[process.env.NODE_ENV];
const knex = require("knex");

const setup = async () => {
  const client = knex(knexConfiguration);
  await client.migrate.latest();
  await client.destroy();
};

module.exports = setup;
