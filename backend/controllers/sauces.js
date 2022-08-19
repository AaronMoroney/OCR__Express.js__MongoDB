const Sauce = require('../models/sauces');
const fs = require('fs'); // file system - gives access to functions that allow you to modify the file system
const { db, updateOne, remove }   = require('../models/sauces'); //check?
const user = require('../models/user');

function removeIfItem(arr, value){
    const index = arr.indexOf(value);
    if(index > -1){
      arr.splice(index,1);
    }
    return arr;
}

function findItem(arr, value){
    const index = arr.indexOf(value);
    if(index > -1){
        return true;
    }
    return false;
}

//save a new sauce 
exports.createSauce = (req, res, next) => {
    //because to send file, frontend sends as form, req.body.sauce
    req.body.sauce = JSON.parse(req.body.sauce);
    //req protocal, http, create the string
    const url = req.protocol + '://' + req.get('host');   //don't have rest of url for filename, onlny that of the img
    const newSauce = new Sauce({
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        imageUrl: url + '/images/' + req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
        usersLiked: [],
        usersDisliked: [],
        userId: req.body.sauce.userId
    });
    newSauce.save().then(
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
};

//delete
exports.deleteSauce = (req, res, next) => {
    //grab the thing from the database 
    //same as single get route
    Sauce.findOne({ _id: req. params.id }).then( //front end sends id
        (sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1]; 
        fs.unlink('images/' + filename, () => {
            //no such thing
            if (!sauce) {
            res.status(404).json({
                error: new Error('no such thing')
            });
            }
            //if the userid of sc. as user form the token
            if(sauce.userId !== req.auth.userId) {
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

//sauce modify
exports.updateSauce = (req, res, next) => {
    //new sauce pass through the update sauce
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

//logic for like functionality
function manageLikesAndDislikes(req, sauce){   
    const userId = req.body.userId;
    const userCurrentlyLike = findItem(sauce.usersLiked, req.body.userId);
    const userCurrentlyDislike = findItem(sauce.usersDisliked, req.body.userId);
    
    const userPressLike = req.body.like == 1;
    const userPressDislike = req.body.like == -1;
    const userPressUnlikeOrDislike = req.body.like == 0;
    //check
    console.table(
        {
            userCurrentlyLike:userCurrentlyLike,
            userCurrentlyDislike:userCurrentlyDislike,
            userPressLike:userPressLike,
            userPressDislike :userPressDislike,
            userPressUnlikeOrDislike:userPressUnlikeOrDislike,
            userId:userId
        }
    );
    //add like
    //add a dislike
    //faizal - we don't need cirly brace here after the if statements?
    if(userPressLike) sauce.usersLiked.push(userId) && sauce.likes++;
    if(userPressDislike) sauce.usersDisliked.push(userId) && sauce.dislikes++; 
    //remove like
    //remove dislike
    if(userPressUnlikeOrDislike && userCurrentlyLike) (sauce.usersLiked = removeIfItem(sauce.usersLiked, req.body.userId)) && sauce.likes--;
    if(userPressUnlikeOrDislike && userCurrentlyDislike) (sauce.usersDisliked = removeIfItem(sauce.usersDisliked, req.body.userId)) && sauce.dislikes--;
  
    return sauce;  
}

exports.sauceLike = (req, res, next) => {
    //get one sauce using param_id
    Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
            console.log('Got Body:', req.body);
            let processedSauce = manageLikesAndDislikes(req, sauce);
            console.log(processedSauce); 
            Sauce.updateOne({_id: req.params.id}, processedSauce ).then(
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
        }
    )
}