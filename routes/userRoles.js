const router = require('express').Router();

// TODO: COMPLETE ENDPOINT FUNCTIONALITY. CURRENT STATE IS TESTING DATA FLOW FOR FRONT END

// * ASIDE FROM AUTH0 USER DATA OBJECT IN FE
// * WE WILL USE THE INFO TO RETRIEVE THE FULL USER SCHEMA FROM AUTH0
router.get('/', (req, res) => {
    const user = req.body;
    console.log('SHOULD BE USER DATA OBJECT FROM FRONT END AUTH0 API CLIENT', user)
})

// * USER INFORMATION TO BE UPDATED FOR ROLE ASSIGNMENT.
router.put('/:id', (req, res) => {
    const user = req.body;
    console.log('SHOULD BE USER DATA OBJECT FROM FRONT END AUTH0 API CLIENT', user)
})

module.exports = router;