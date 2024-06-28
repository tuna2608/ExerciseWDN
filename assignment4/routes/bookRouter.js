
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var authenticate = require('../authenticate');
const Books = require('../models/books');
const Comments = require('../models/comments');

const bookRouter = express.Router();

bookRouter.use(bodyParser.json());

bookRouter.route('/')
    .get((req, res, next) => {
        Books.find({})
            .populate('comments.author')
            .populate('comments')
            .then((Books) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Books);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyAdmin, (req, res, next) => {
        Books.create(req.body)
            .then((book) => {
                console.log('book Created ', book);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Books');
    })
    .delete(authenticate.verifyAdmin, (req, res, next) => {
        Books.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

bookRouter.route('/:bookId')
    .get((req, res, next) => {
        Books.findById(req.params.bookId)
            .populate('comments.author')
            .then((book) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /Books/' + req.params.bookId);
    })
    .put(authenticate.verifyAdmin, (req, res, next) => {
        Books.findByIdAndUpdate(req.params.bookId, {
            $set: req.body
        }, { new: true })
            .then((book) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyAdmin, (req, res, next) => {
        Books.findByIdAndRemove(req.params.bookId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

bookRouter.route('/:bookId/comments')
    .get((req, res, next) => {
        Books.findById(req.params.bookId)
            .populate('comments')
            .then((book) => {
                if (book != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(book.comments);
                }
                else {
                    err = new Error('book ' + req.params.bookId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        Books.findById(req.params.bookId)
        .then((book) => {
            if (book != null) {
                req.body.author = req.user._id;//gán author of commnet = user
                Comments.create(req.body)
                    .then((comment) => {
                        book.comments.push(comment._id);
                        book.save()
                            .then((book) => {
                                Books.findById(book._id)
                                    .populate('comments')
                                    .populate('comments.author')
                                    .then((book) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(book);
                                    });
                            }, (err) => next(err));
                    }, (err) => next(err));
            } else {
                err = new Error('Book ' + req.params.bookId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Books/'
            + req.params.bookId + '/comments');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Books.findById(req.params.bookId)
            .then((book) => {
                if (book != null) {
                    for (var i = (book.comments.length - 1); i >= 0; i--) {
                        book.comments.id(book.comments[i]._id).remove();
                    }
                    book.save()
                        .then((book) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(book);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('book ' + req.params.bookId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

bookRouter.route('/:bookId/populate')
    .get((req, res, next) => {
        Books.findById(req.params.bookId)
            .populate({
                path: 'comments',
                match: {
                    comment: { $regex: /(excellence|good|excellent)/i }
                }
            })
            .then((book) => {
                if (book != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(book.comments);
                } else {
                    let err = new Error('Book ' + req.params.bookId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });
module.exports = bookRouter;