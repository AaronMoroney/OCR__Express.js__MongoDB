//import bcrypt 
const bcrypt = require('bcrypt');
//import user model 
const User = require('../models/user');
const jwt = require('jsonwebtoken');

//signup
exports.signup = (req, res, next) => {
    //firsr argument = data, 2 argument
    //12 = number of salting iteration
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save().then(
                () => {
                    res.status(201).json({
                        errorMsg: 'new user registered successfully!'
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
                    errorMsg: 'User cannot be found'
                });
            }
            bcrypt.compare(req.body.password, user.password).then(
                (valid) => {
                    if(!valid) {
                        return res.status(401).json({
                            errorMsg: 'incorrect user password, please try again'
                        });
                    }
                    //working
                    const token = jwt.sign(
                         { userId: user._id},
                         'RANDOM_VERY_LONG_VERY_CRYPTIC_TOKEN',
                         { expiresIn: '12h'});
                    res.status(200).json({
                        userId: user._id,
                        token: token
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