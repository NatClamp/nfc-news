exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (usersTable) => {
    usersTable
      .increments('user_id')
      .primary()
      .unique();
    usersTable.string('username').unique();
    usersTable.string('avatar_URL');
    usersTable.string('name');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
