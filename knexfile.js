// Update with your config settings.

const { DB_URL } = process.env;

module.exports = {
  production: {
    client: 'pg',
    connection: `${DB_URL}?ssl=true`,
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seed',
    },
  },
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
