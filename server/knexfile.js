const defaultConfig = {
  client: 'pg',
  migrations : {
    directory: __dirname + '/db/migrations',
    tableName: 'migrations'
  },
  seeds: {
    directory: __dirname + '/db/seeds',
  }
}

module.exports = {
  test: {
    ...defaultConfig,
    // connection: 'postgres://localhost/ravel_test',
    connection: process.env.DATABASE_URL_TEST
  },
  development: {
    ...defaultConfig,
    // connection: 'postgres://localhost/ravel',
    connection: process.env.DATABASE_URL
  },
  production: {
    ...defaultConfig,
    connection: process.env.DATABASE_URL,
  }
}