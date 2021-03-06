exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (articleTable) => {
    articleTable.increments('article_id').primary();
    articleTable.string('title', 5000).notNullable();
    articleTable.string('body', 5000).notNullable();
    articleTable.integer('votes').defaultTo(0);
    articleTable.string('topic', 5000).references('topics.slug');
    articleTable.integer('user_id').references('users.user_id');
    articleTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
