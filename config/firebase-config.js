require("dotenv").config();

const firebase = require("firebase-admin");
const serviceAccount = require("./firebase-service-acct");

module.exports = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});
