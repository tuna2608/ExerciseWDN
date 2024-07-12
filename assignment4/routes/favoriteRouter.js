
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var authenticate = require('../authenticate');
const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        Favorites.find({})
            .populate('author')
            .populate('listFavorite')
            .then((Favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ author: req.user._id })
            .then((favorite) => {
                const dishIds = req.body.map(dish => dish.id);

                if (favorite) {
                    // Add dishIds to listFavorite if they are not already present
                    dishIds.forEach(dishId => {
                        if (!favorite.listFavorite.includes(dishId)) {
                            favorite.listFavorite.push(dishId);
                        }
                    });
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err));
                } else {
                    // Create a new Favorites document if one doesn't exist
                    Favorites.create({
                        author: req.user._id,
                        listFavorite: dishIds
                    })
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Favorites');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOneAndUpdate(
            { author: req.user._id },
            { $set: { listFavorite: [] } },
            { new: true }
        )
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
    .get(authenticate.verifyUser, (req, res, next) => {
        Favorites.find({})
            .populate('author')
            .populate('listFavorite.dish')
            .then((Favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ author: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    // Check if the dishId already exists in the listFavorite array
                    if (favorite.listFavorite.indexOf(req.params.dishId) === -1) {
                        favorite.listFavorite.push(req.params.dishId);
                        favorite.save()
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }, (err) => next(err));
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }
                } else {
                    Favorites.create({
                        author: req.user._id,
                        listFavorite: [req.params.dishId]
                    })
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Favorites');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ author: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    // Remove the dishId from listFavorite array
                    const dishIndex = favorite.listFavorite.indexOf(req.params.dishId);
                    if (dishIndex !== -1) {
                        favorite.listFavorite.splice(dishIndex, 1);
                        favorite.save()
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }, (err) => next(err));
                    } else {
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ error: 'Dish not found in favorites' });
                    }
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ error: 'Favorites not found' });
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:favoriteId/populate')
    .get((req, res, next) => {
        Favorites.findById(req.params.favoriteId)
            .populate({
                path: 'comments',
                match: {
                    comment: { $regex: /(excellence|good|excellent)/i }
                }
            })
            .then((favorite) => {
                if (favorite != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite.comments);
                } else {
                    let err = new Error('favorite ' + req.params.favoriteId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });
module.exports = favoriteRouter;