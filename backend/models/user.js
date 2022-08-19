const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const usersSchema = mongoose.Schema({
    //unique prevents duplication
    email: { type: String, required: true, unique: true }, //working
    password: {type: String, required: true}
});

usersSchema.plugin(uniqueValidator);
//user data model creation, can now use to save users to the DB
module.exports = mongoose.model('User', usersSchema);