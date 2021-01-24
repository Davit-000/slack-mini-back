
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          name: 'John Doe',
          email: 'john@doe.com',
          password: '$2a$12$BbtUAPcG5dXw/kyIcJwa9.SGVaTZddJwpN8qwj218BHgn66tSRooC' // password
        },
      ]);
    });
};
