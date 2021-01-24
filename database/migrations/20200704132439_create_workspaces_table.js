
exports.up = knex => {
  return knex.schema.createTable('workspaces', table => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.string('name');
    table.string('sub_domain').unique();

    table.foreign('user_id')
      .references('id')
      .inTable('users')
      .onUpdate('cascade')
      .onDelete('cascade');
  });
};

exports.down = knex => {
  return knex.schema.dropTableIfExists('workspaces');
};
