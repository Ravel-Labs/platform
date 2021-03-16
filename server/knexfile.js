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
  test: {
    ...defaultConfig,
    connection: process.env.DATABASE_URL_TEST,
  },
  development: {
    ...defaultConfig,
    connection: process.env.DATABASE_URL_DEV,
  },
  production: {
    ...defaultConfig,
    connection: process.env.DATABASE_URL,
  },
};
