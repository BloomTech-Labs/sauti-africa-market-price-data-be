const knex = require("knex")

const config = require("./knexfile.js")

// we must select the development object from our knexfile
const db = knex(config.development) //TODO: change this to be dynamic later

// export for use in codebase
module.exports = db
