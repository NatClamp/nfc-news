exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.integer('user_id').references('users.user_id');
    commentsTable.integer('article_id').references('articles.article_id');
    commentsTable.integer('votes').defaultsTo(0);
    commentsTable.timestamp('created_at');
    commentsTable.string('body').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};