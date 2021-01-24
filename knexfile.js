// Update with your config settings.

module.exports = {

  development: {
    client: process.env.DB_CONNECTION || 'mysql2',
    connection: {
      // version: '8.0.16',
      host : process.env.DB_HOST || '127.0.0.1',
      database : process.env.DB_DATABASE || 'slack',
      user : process.env.DB_USERNAME || 'root',
      password : process.env.DB_PASSWORD || '',
    },
    migrations: {
      tableName: 'migrations',
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
