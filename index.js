require("dotenv").config();
const server = require("./api/server");

//Initialize Moesif and set up the middleware
const moesifExpress = require("moesif-express");
const moesifMiddleware = moesifExpress({
  applicationId: process.env.MOESIF_ID || undefined,
  logBody: true
});

//Server uses middleware to add functionality
server.use(moesifMiddleware);

const port = process.env.PORT || 8888;

server.listen(port, () => {
  console.log(`\n=== Server listening on port ${port} ===\n`);
});
