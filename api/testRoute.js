const express = require("express");
const router = express.Router();
const firebase = require("../config/firebase-config");

// const admin = require('firebase-admin')
// const serviceAccount = require('../secret/testing-firebase-backend-firebase-adminsdk-tvp0l-3f6801886f.json')
// const firebaseAdmin = admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://testing-firebase-backend.firebaseio.com'
// })

router.get("/", async (req, res) => {
  try {
    const userRequest = await firebase.database().ref(`users/${req.body.uid}`);
    const userPayload = await userRequest.val();

    if (userPayload) {
      const tokenClaims = {
        /*=== create tokenClaims if you wish to add extra data to the generated user token ===*/
        //TODO: Find out what Michael called the API key in the document
      };
    }

    res.status(200).json({
      data: tokenClaims
    });
  } catch (err) {
    res.status(404).json({
      error: err //TODO: change to real message after dev
    });
  }
});

module.exports = router;
