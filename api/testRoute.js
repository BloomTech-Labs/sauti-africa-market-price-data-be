const express = require('express');
const router = express.Router();
const admin = require('firebase-admin')
const serviceAccount = require('../secret/testing-firebase-backend-firebase-adminsdk-tvp0l-3f6801886f.json')
const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://testing-firebase-backend.firebaseio.com'
})


router.get('/', (req, res) => {
    
});



module.exports = router;