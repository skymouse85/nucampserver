const express = require('express');
const Favorite = require('../models/favorite');
const cors = require('./cors');
const authenticate = require('../authenticate');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('favorite.user')
            .populate('favorite.campsites')
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(foundFavorite => {
                if (!foundFavorite) {
                    Favorite.create({ user: req.user._id, campsites: req.body })
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
                else {
                    req.body.forEach(favToCheck => {
                        const wasFound = foundFavorite.campsites.find(savedFavorite => savedFavorite.equals(favToCheck._id));
                        if (!wasFound) {
                            foundFavorite.campsites.push(favToCheck);
                        }

                    });

                    foundFavorite.save()
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
            })

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /campsites');

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then(response => {
                if (response) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                }
                else {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You do not have any favorite to delete.');
                }
            })
            .catch(err => next(err));
    })


favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);

    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(foundFavorite => {
                if (!foundFavorite) {
                    Favorite.create({ user: req.user._id, campsites: req.params.campsiteId })
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
                else {
                    const wasFound = foundFavorite.campsites.find(savedFavorite => savedFavorite.equals(req.params.campsiteId));
                    if (!wasFound) {
                        foundFavorite.campsites.push(req.params.campsiteId);
                        foundFavorite.save()
                            .then(favorite => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            })
                            .catch(err => next(err));
                    }
                    else {
                        res.end('That campsite is already in the list of favorites!');
                    }
                }
            })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(foundFavorite => {
                if (foundFavorite) {
                    const campsiteFavExists = foundFavorite.campsites.indexOf(campsiteId => campsiteId.equals(req.params.campsiteId)) !== -1;
                    if (campsiteFavExists) {
                        foundFavorite.campsites = foundFavorite.campsites.filter(campsiteId => !campsiteId.equals(req.params.campsiteId));
                        foundFavorite.save()
                            .then(favorite => {
                                // console.log('Favorite Deleted ', favorite);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            })
                            .catch(err => next(err));
                    }
                    else {
                        res.statusCode = 400;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end(`You do not have the campsite ID ${req.params.campsiteId} favorited to delete.`);
                    }
                }
                else {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You do not have a favorites profile.');
                }
            })
            .catch(err => next(err));
    })

module.exports = favoriteRouter