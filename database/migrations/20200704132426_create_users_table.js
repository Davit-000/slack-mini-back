
exports.up = knex => {
  return knex.schema.createTable('users', function(table) {
    table.increments().primary();
    table.string('name');
    table.string('email').unique();
    table.string('password');
    table.string('api_token').nullable();
    table.timestamps();
  });
};

exports.down = knex => {
  return knex.schema.dropTableIfExists('users');
};
