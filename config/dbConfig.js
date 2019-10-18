const knex = require("knex")

const secrets = require("./secrets.js")

const environment = secrets.environment || "development"
const config = require("../knexfile.js")[environment]

// { development: {} }
// config.development === config["development"]

module.exports = knex(config)
