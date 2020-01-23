const router = require('express').Router();
const { fetchUserSchema, assignUserRole } = require('./utils');

// * RETRIEVE THE FULL USER SCHEMA FROM AUTH0
router.post('/', async (req, res) => fetchUserSchema(req, res))

// * USER INFORMATION TO BE UPDATED FOR ROLE ASSIGNMENT.
router.put('/:id', async (req, res) => assignUserRole(req, res))

module.exports = router;