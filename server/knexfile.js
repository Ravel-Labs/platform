var config = require("./config");

const defaultConfig = {
  client: "pg",
  migrations: {
    directory: __dirname + "/db/migrations",
    tableName: "migrations",
  },
  seeds: {
    directory: __dirname + "/db/seeds",
  },
};

module.exports = {
  development: {
    ...defaultConfig,
    connection: config.databaseURLDev,
  },
  // test runs in local test runs.
  test: {
    ...defaultConfig,
    connection: config.databaseURLTest,
  },
  // testCI runs test suite in CI.
  testCI: {
    ...defaultConfig,
    connection: {
      host: "postgres",
      port: 5432,
      user: "postgres",
      password: "postgres",
      database: "ravel_test",
    },
  },
  production: {
    ...defaultConfig,
    connection: config.databaseURLProd,
  },
};
