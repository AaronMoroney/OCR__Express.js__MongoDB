const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SauceCtrl = require('../controllers/sauces');

//retrieve an array of sc
router.get('/', auth, SauceCtrl.SaucesList);
//single sauce(findOne)
router.get('/:id', auth, SauceCtrl.getOneSauce); 
//saving new sauces to DB
router.post('/', auth, SauceCtrl.createSauce);

module.exports = router;