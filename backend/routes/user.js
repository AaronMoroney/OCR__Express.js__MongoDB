const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

//POST route for signup
router.post('/signup', userCtrl.signup );
router.post('/login', userCtrl.login );

//export router
module.exports = router;