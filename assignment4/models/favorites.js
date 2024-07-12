const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

var favoriteSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    listFavorite:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
}, {
    timestamps: true
});

var Favorites = mongoose.model('Favourite', favoriteSchema);

module.exports = Favorites;