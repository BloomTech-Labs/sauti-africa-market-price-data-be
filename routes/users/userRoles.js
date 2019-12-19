// TODO: COMPLETE ENDPOINT FUNCTIONALITY. CURRENT STATE IS TESTING DATA FLOW FOR FRONT END
const router = require('express').Router();
const { fetchUserSchema } = require('./utils');

// * RETRIEVE THE FULL USER SCHEMA FROM AUTH0
router.post('/', async (req, res) => fetchUserSchema(req, res))

// * USER INFORMATION TO BE UPDATED FOR ROLE ASSIGNMENT.
router.put('/:id', (req, res) => {
    const user = req.body;
    console.log('SHOULD BE USER DATA OBJECT FROM FRONT END AUTH0 API CLIENT', user)
})

module.exports = router;