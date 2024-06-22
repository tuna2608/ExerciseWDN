const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    publication_year: {
        type: Number,
        required: true,
    },
    Genre: {
        type: String,
        default: ''
    },
    Summary: {
        type: String,
        required: true,
    },
    contents: {
        type: String,
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
});

var Books = mongoose.model('Book', bookSchema);

module.exports = Books;