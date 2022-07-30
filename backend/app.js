//mogoDB user password: bvwhp.wt8WZMq-Z
//mongodb+srv://Aaron:<password>@clusterp6.4lgnl.mongodb.net/?retryWrites=true&w=majority

//import framework
const express = require('express');

const app = express();
const mongoose = require('mongoose');

/*
app.get('', (req, res, next) => {
    const dataSchema = [
        {
            _id!: string,
            name!: string,
            manufacturer!: string,
            description!: string,
            heat!: number,
            likes!: number,
            dislikes!: number,
            imageUrl!: string,
            mainPepper!: string,
            usersLiked!: string[}
            usersDisliked!: string[];
            userId!: string,
        },
    ];
});
*/


//allow cross origin resource sharing for development
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});



mongoose.connect('mongodb+srv://Aaron:bvwhp.wt8WZMq-Z@clusterp6.4lgnl.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to mongoDB');
    })
    .catch((error) => {
        console.log('unable to connect to mongoDB');
        console.error(error);
    });

//const app = express();

//test message
app.use((req, res) => {
    res.json({ message: 'hello world, server is live'});
});

//access it outside this file
module.exports = app