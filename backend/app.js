//mogoDB user password: bvwhp.wt8WZMq-Z
//mongodb+srv://Aaron:<password>@clusterp6.4lgnl.mongodb.net/?retryWrites=true&w=majority

//import framework
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
app.use(express.json());
//const sauces = require('./models/sauces');
const saucesRoutes = require('./routes/sauces')
//import router into app
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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//tells the app which static folder to serve 
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
//requests are going to api/auth - and then going to userRoutes
//register
app.use('/api/auth', userRoutes);


//access it outside this file
module.exports = app;