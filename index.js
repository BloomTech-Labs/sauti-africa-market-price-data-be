require('dotenv').config()
//Root of the server, server.js initialize all server packages and routes. It is located in 'api' folder
const server = require('./api/server')

const port = process.env.PORT || 8888

server.listen(port, () => {
  console.log(`\n=== Server listening on port ${port} ===\n`)
})
