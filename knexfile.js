// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'news_database',
    },
  },
  test: {
    client: 'pg',
    connection: {
      database: 'test_news_database',
    },
  },
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seed',
  },
};
