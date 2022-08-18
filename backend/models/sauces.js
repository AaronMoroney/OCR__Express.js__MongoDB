const mongoose = require('mongoose');
//allows us to import sauceSchema(model) into the app
//use to find, create etc.
const sauceSchema = mongoose.Schema({
    //_id: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: false },
    dislikes: { type: Number, required: false },
    imageUrl: { type: String, required: true },
    mainPepper: { type: String, required: true }, 
    usersLiked: [{ type: String, required: false }],
    usersDisliked: [{ type: String, required: false}],
    userId: { type: String, required: true}
})

module.exports = mongoose.model('Sauce', sauceSchema);