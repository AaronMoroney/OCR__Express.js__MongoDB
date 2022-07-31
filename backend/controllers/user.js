//import bcrypt 
const bcrypt = require('bcrypt');
//import user model 
const User = require('../models/user');

//signup
exports.signup = (req, res, next) => {
    //firsr argument = data, 2 argument
    //12 = number of salting iteration
    bcrypt.hash(req.body.password, 12).then(
        (hash) => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save().then(
                () => {
                    res.status(201).json({
                        message: 'new user registered successfully!'
                    });
                }
            ).catch(
                (error) => {
                    //500 server error
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    );
};

//login
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }).then(
        (user) => {
            if (!user) {
                return res.status(401).json({
                    error: new Error('User not found!')
                });
            }
            bcrypt.compare(req.body.password, user.password).then(
                (valid) => {
                    if(!valid) {
                        return res.status(401).json({
                            error: new Error('incorrect user password, please try again')
                        });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: 'temporary token'
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            })
        })
}