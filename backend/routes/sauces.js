const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SauceCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer-config')



//retrieve an array of sc
router.get('/', auth, SauceCtrl.SaucesList); 
//saving new sauces to DB
router.post('/', auth, multer, SauceCtrl.createSauce);
//single sauce(findOne)
router.get('/:id', auth, SauceCtrl.getOneSauce); 
//update sauce
router.put('/:id', auth, multer, SauceCtrl.updateSauce);
//delete a sauce
router.delete('/:id', auth, SauceCtrl.deleteSauce);
//like & dislike a sauce 
router.post('/:id/like', auth, SauceCtrl.sauceLike);

module.exports = router;