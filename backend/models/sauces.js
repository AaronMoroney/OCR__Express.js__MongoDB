const mongoose = require('mongoose');
//allows us to import sauceSchema(model) into the app
//use to find, create etc.
const sauceSchema = mongoose.Schema({
    //_id: { type: string, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    imageUrl: { type: String, required: true },
    mainPepper: { type: String, required: true }, 
    usersLiked: [{ type: String, required: true }],
    usersDisliked: [{ type: String, required: true }],
    userId: { type: String}
})

module.exports = mongoose.model('Sauce', sauceSchema);