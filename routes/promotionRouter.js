const express = require('express');
// const { response } = require('../app');
const Promotion = require('../models/promotion');


const promotionRouter = express.Router();

promotionRouter.route('/')
    .get((req, res, next) => {
        Promotion.find()
            .then(promotions => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions);
            })
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        Promotion.create(req.body)
            .then(promotion => {
                console.log('Partner Created ', promotion);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions);
            })
            .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete((req, res, next) => {
        Promotion.deleteMany()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

promotionRouter.route('/:promotionId')

    .get((req, res, next) => {
        Promotion.findById(req.params.promotionId)
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            })
            .catch(err => next(err));
    })
    .post((req, res) => {
        res.end(`POST operation not supported on /promotions/${req.params.promotionsId}`);
    })
    .put((req, res, next) => {
        Promotion.findByIdAndUpdate(req.params.promotionId, {
            $set: req.body
        }, { new: true })
            .then(promotion => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            })
            .catch(err => next(err));
    })
    .delete((req, res, next) => {
        Promotion.findByIdAndDelete(req.params.promotionId)
            .then(promotion => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

module.exports = promotionRouter;

