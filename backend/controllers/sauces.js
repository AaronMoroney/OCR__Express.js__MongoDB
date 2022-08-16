const Sauce = require('../models/sauces');
const fs = require('fs');

//save a new sauce 
exports.createSauce = (req, res, next) => {
    //because to send file, frontend sends as form, req.body.sauce
    //is string, so we turn it into JSON
    //parse now workable as JSON 
    req.body.sauce = JSON.parse(req.body.sauce);
    //don't have rest of url for filename, onlny that of the img
    //req protocal, http, create the string
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


//delete
exports.deleteSauce = (req, res, next) => {
    //grab the thing from the database 
    //same as single get route
    Sauce.findOne({ _id: req. params.id }).then(
        (sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1]; 
        fs.unlink('images/' + filename, () => {
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
            ) 
        })
    });
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

/*
//need to add to mongoDB
*/

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

//sauce modify

exports.updateSauce = (req, res, next) => {
    //this new sauce is the sauce we want to pass 
    //through the update sauce
    let sauce = new Sauce({_id: req.params._id});
    if (req.file) {
            const url = req.protocol + '://' + req.get('host');
            req.body.sauce = JSON.stringify(req.body.sauce);
            sauce = ({
            _id: req.params.id,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            heat: req.body.sauce.heat,
            likes: req.body.sauce.likes,
            dislikes: req.body.sauce.likes,
            imageUrl: url + '/images/' + req.file.filename,
            mainPepper: req.body.sauce.mainPepper,
            usersLiked: req.body.sauce.usersLiked,
            usersDisliked: req.body.sauce.usersDisliked,
            userId: req.body.sauce.userId
        });
    } else {
            sauce = ({
            _id: req.params.id,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            heat: req.body.heat,
            likes: req.body.likes,
            dislikes: req.body.likes,
            imageUrl: req.body.imageUrl,
            mainPepper: req.body.mainPepper,
            usersLiked: req.body.usersLiked,
            usersDisliked: req.body.usersDisliked,
            userId: req.body.userId
        });
    }
    Sauce.updateOne({_id: req.params.id}, sauce).then(
        () => {
            res.status(201).json({
                message: 'sauce updated successfully!'
            })
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
