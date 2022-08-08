const Sauce = require('../models/sauces');
//const auth = require('../middleware/auth');
//const jwt = require('jsonwebtoken');

//save a new sauce 
exports.createSauce = (req, res, next) => {
    //req.protocol = http: + :// + localhost:3000
    //convert data to JSON 
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
    const newSauce = new Sauce({
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        heat: req.body.sauce.heat,
        likes: req.body.likes,
        dislikes: req.body.likes,
        imageUrl: url + '/images/' + req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
        usersLiked: req.body.usersLiked,
        usersDisliked: req.body.usersDisliked,
        userId: req.body.sauce.userId
    });
    newSauce.save().then(
        //front end res
        //always when handling http req
        () => {
            res.status(201).json({
                message: 'Post saved!'
            });
        }
    ).catch(
       (error) => {
        res.status(400).json({
            errorMsg: 'cannot create sauce'
        });
       } 
    );
}


//find one sc
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
}

/*
** !! BUG - cannot edit, or assign correctly usersLiked / disLiked !!
*/

//delete
exports.deleteSauce = (req, res, next) => {
    //grab the thing from the database 
    //same as single get route
    Sauce.findOne({_id: req.params.id}).then(
        //returns sauce
        (sauce) => {
            //no such thing
          if (!sauce) {
            //return;
            res.status(404).json({
                error: new Error('no such thing')
            });
          }
          //if the userid of thing is the same
          //as user form the token
          if(sauce.userId !== req.auth.userId) {
            //return;
            res.status(400).json({
                error: new Error('unauthorized request!')
            })
          }
          Sauce.deleteOne({ _id: req.params.id }).then(
            () => {
                res.status(200).json({
                    message: 'sauce deleted!'
                });
            }
            ).catch(
                (error) => {
                    res.status(400).json({
                        error: error
                    });
                }
            );  
        }
    )
}

//retrieve a list
exports.SaucesList = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}


exports.sauceLike = (req, res, next) => {
    //get one sauce using param_id
    Sauce.findOne({_id: req.params.id}).then(
        //returns sauce
        (sauce) => {
            console.log('Got Body:', req.body); // working
            if (req.body.like === -1 && !sauce.usersDisliked.includes(req.body.userId)) {
                sauce.usersDisliked.push(sauce.userId); //working
                console.log('like = -1:', sauce);
                res.status(200).json(sauce);
            } else if (req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId)) {
                sauce.usersLiked.push(sauce.userId); //working
                console.log('like = 1:', sauce);
                res.status(200).json(sauce);
            } else if (req.body.like === 0) {
                res.status(200).json(sauce);
                console.log('will be deleted', sauce);
            } else {
                console.log('error');
            }
        }
    )
}


/*
exports.sauceLike = (req, res, next) => {
    //get one sauce using param_id
    Sauce.findOne({_id: req.params.id}).then(
        //returns sauce
        (sauce) => {
        console.log('Got Body:', req.body); // working
            //JSON.parse(req.body.sauce);
            if ( req.body.like === 0 && sauce.usersLiked.includes(req.params.Id)) {
            //get index of the user id and splice from the index
                let index = sauce.usersLiked.indexOf(sauce.userId);
                //if result is true
                if (index != -1) {
                    sauce.usersLiked.splice(index, 1);
                }
            console.log('like = 0:', sauce.usersLiked);
            //if like = 1 and user isn't in the usersliked array
            } else if ( req.body.like === 1 && sauce.usersLiked.includes(req.params.Id) ) {
                //push the userId into the array
                sauce.usersLiked.push(sauce.userId); //working
                console.log('like = 1:', sauce);
            }
            res.status(200).json(sauce);
        }
    )
}
*/



