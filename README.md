# NFC-news

## Background

This is a News API built as a project during the back-end block and used to practice front-end in my time at Northcoders. The database is PSQL, and interacted with using [Knex](https://knexjs.org).

You can access the deployed version via [nfc-news](https://nfc-news.herokuapp.com/api) on heroku.

## Prerequisites

Ensure that you have psql installed and initialised.

Clone down this repository from github.

Install the dependencies by using `npm i` and `npx i knex` in terminal.

Populate the `knexfile.js` with your configuration settings. If using linux, this file will also require your psql username and password.

```
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
      user: '<YOUR_USERNAME>',
      password: '<YOUR_PASSWORD>',
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
      user: '<YOUR_USERNAME>',
      password: '<YOUR_PASSWORD>',
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seed',
    },
  },
};
```

You can rollback, create tables and seed the tables with data by using the commands:
`knex migrate:rollback`
`knex migrate:latest`
`knex seed:run`

## Endpoints

The following endpoints serve data:
- **GET** /api 
- **GET** /api/topics
- **POST** /api/topics
- **GET** /api/topics/:topic/articles
- **POST** /api/topics/:topic/articles
- **GET** /api/articles
- **GET** /api/articles/:article_id
- **PATCH** /api/articles/:article_id
- **DELETE** /api/articles/:article_id
- **GET** /api/articles/:article_id/comments
- **POST** /api/articles/:article_id/comments
- **PATCH** /api/comments/:comment_id
- **DELETE** /api/comments/:comment_id
- **GET** /api/users
- **GET** /api/users/:username

### Running Tests

You can run tests on this service by using `npm t`

### Built With
- `Express`
- `Knex`
- `Pg-Promise`
- `Body-Parser`

### Tested With
- `mocha`
- `chai`
- `husky`
- `nodemon`
- `supertest`

See package.json for the versions used for each of these dependencies.