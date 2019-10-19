// Update with your config settings.
module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./api-key/apiKey.db3"
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_keys = ON", done)
      }
    },
    migrations: {
      directory: "./api-key/migrations"
    },
    // seeds: {
    //   directory: "./seeds"
    // },
    useNullAsDefault: true
  },
  testing: {
    client: "sqlite3",
    connection: {
      filename: "./database/test.db3"
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./database/migrations"
    },
    seeds: {
      directory: "./database/seeds"
    }
  },
  production: {
    client: "pg", // install this package
    connection: process.env.DATABASE_URL, // heroku sets this env variable
    migrations: {
      directory: "./database/migrations"
    },
    seeds: {
      directory: "./database/seeds"
    }
  },
  sauti: {
    client: "mysql", // install this package
    connection: process.env.ST_DATABASE_URL
  }
}
