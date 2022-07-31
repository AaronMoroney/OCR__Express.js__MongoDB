//mogoDB user password: bvwhp.wt8WZMq-Z
//mongodb+srv://Aaron:<password>@clusterp6.4lgnl.mongodb.net/?retryWrites=true&w=majority

//import framework
const express = require('express');

const app = express();
//Modern body parser technique
//Pword and Usernam entry on front end need to capture the data as POST req
//JSON data part of req. body
app.use(express.json());

const mongoose = require('mongoose');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//imoort router into app
const userRoutes = require('./routes/user');
//const usersSchema = require('./models/user');
//connect to mongoDB
mongoose.connect('mongodb+srv://Aaron:bvwhp.wt8WZMq-Z@clusterp6.4lgnl.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to mongoDB');
    })
    .catch((error) => {
        console.log('unable to connect to mongoDB');
        console.error(error);
    });


//allow cross origin resource sharing for development

/*
app.post('/api/auth/signup', (req, res, next) => {
    const UsersSchema = new usersSchema({
        email: req.body.email,
        password: req.body.password
    });
    signupData.save().then(
        () => {
            res.json({
                message: 'User data created successfully!'
            });
        } 
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    )
});
*/


//test message
/*
app.use((req, res) => {
    res.json({ message: 'hello world, server is live'});
});
*/

//requestds are going to api/auth - and then going ton userRoutes
//register
app.use('/api/auth', userRoutes);


//access it outside this file
module.exports = app