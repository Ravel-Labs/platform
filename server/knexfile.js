module.exports = {

  test: {
    client: 'pg',
    connection: 'postgres://localhost/ravel_test',
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + 'db/seeds/test'
    }
  },

  development: {
    client: 'pg',
    connection: 'postgres://localhost/ravel',
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + 'db/seeds/development'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URI,
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + 'db/seeds/production'
    }
  }

};
