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
    connection: 'postgres://localhost/ravel_test',
  },
  development: {
    ...defaultConfig,
    connection: 'postgres://localhost/ravel',
  },
  production: {
    ...defaultConfig,
    connection: process.env.DATABASE_URI,
  }
}