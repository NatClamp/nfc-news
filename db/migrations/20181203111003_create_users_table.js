exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (usersTable) => {
    usersTable
      .increments('user_id')
      .primary()
      .unique();
    usersTable.string('username', 5000).unique();
    usersTable.string('avatar_url', 5000);
    usersTable.string('name', 5000);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
