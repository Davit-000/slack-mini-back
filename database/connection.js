const Knex = require('knex');
const { Model } = require('objection');

// Initialize knex.
const knex = Knex({
  client: process.env.DB_CONNECTION,
  useNullAsDefault: true,
  connection: {
    host : process.env.DB_HOST,
    database : process.env.DB_DATABASE,
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
  },
  migrations: {
    tableName: 'migrations'
  }
});

// Give the knex instance to objection.
Model.knex(knex);

module.exports = knex;
