const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const bookSchema = new Schema({
    isbn: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    subtitle: {
        type: String,
        required: true,
    },
    publish_date: {
        type: String,
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    pages: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    website: {
        type: String,
        default: ''
    },
    genre: {
        type: String,
        default: ''
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

var Books = mongoose.model('Book', bookSchema);

module.exports = Books;