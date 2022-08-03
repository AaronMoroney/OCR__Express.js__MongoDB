const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/*
● User passwords must be hashed.
● Authentication must be reinforced on all of the required Sauce routes.
● Email addresses in the database are unique. An appropriate Mongoose
plugin is used to ensure their uniqueness and report errors.
*/

const usersSchema = mongoose.Schema({
    //unique prevents duplication
    email: { type: String, required: true, unique: true }, //working
    password: {type: String, required: true}
});

usersSchema.plugin(uniqueValidator);
//user data model creation, can now use to save users to the DB
module.exports = mongoose.model('User', usersSchema);