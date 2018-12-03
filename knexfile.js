// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'news_database',
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seed',
    },
  },
  test: {
    client: 'pg',
    connection: {
      database: 'test_news_database',
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seed',
    },
  },
};
