'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Round = mongoose.model('Round'),
    _ = require('lodash');


/**
 * Find round by id
 */
exports.round = function(req, res, next, id) {
    Round.load(id, function(err, round) {
        if (err) return next(err);
        if (!round) return next(new Error('Failed to load round ' + id));
        req.round = round;
        next();
    });
};

/**
 * Create an round
 */
exports.create = function(req, res) {

    var round = new Round(req.body);
    round.user = req.user;
    round.save(function(err) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot save the round'
            });
        }
        res.jsonp(round);
    });
};

/**
 * Update an round
 */
exports.update = function(req, res) {
    var round = req.round;

    round = _.extend(round, req.body);

    round.save(function(err) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot update the round'
            });
        }
        res.jsonp(round);
    });
};

/**
 * Delete an round
 */
exports.destroy = function(req, res) {
    var round = req.round;

    round.remove(function(err) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot delete the round'
            });
        }
        res.jsonp(round);
    });
};

/**
 * Show an round
 */
exports.show = function(req, res) {
    res.jsonp(req.round);
};

/**
 * List of rounds
 */
exports.all = function(req, res) {
    Round.find().sort('-created').populate('user', 'name username').exec(function(err, rounds) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot list the rounds'
            });
        }
        res.jsonp(rounds);
    });
};
