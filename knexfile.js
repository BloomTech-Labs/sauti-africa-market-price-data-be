module.exports = {
  /*=== development ===*/
  development: {
    client: 'sqlite3',
    connection: {
      filename: './api-key/apiKey.db3'
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foreign_keys = ON', done)
      }
    },
    migrations: {
      directory: './api-key/migrations'
    },
    useNullAsDefault: true
  },

  /*=== testing ===*/
  test: {
    client: 'sqlite3',
    connection: {
      filename: './api-key/apiKey-testing.db3'
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foreign_keys = ON', done)
      }
    },
    useNullAsDefault: true,
    migrations: {
      directory: './api-key/migrations'
    }
  },

  /*=== production ===*/
  production: {
    client: 'pg', // install this package
    connection: process.env.DATABASE_URL, // heroku sets this env variable
    migrations: {
      directory: './api-key/migrations'
    }
  },

  /*=== Sauti Africa Market Database ===*/
  sauti: {
    client: 'mysql', // install this package
    connection: process.env.ST_DATABASE_URL
  }
}
